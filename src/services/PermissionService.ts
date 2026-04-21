/**
 * PermissionService — runtime grant/revoke + status + consent ledger logging.
 *
 * Web/PWA implementation today. When the app is wrapped with Capacitor,
 * native plugin calls slot in here without changing call-sites.
 */

import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/utils/deviceId';
import {
  PERMISSION_REGISTRY,
  PermissionId,
  PermissionSpec,
  PURPOSE_VERSION,
  getPermission,
} from '@/data/permissionsRegistry';

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'prompt'           // never asked yet
  | 'unsupported'      // platform can't provide
  | 'revoked';         // user revoked in our app

interface PermissionRecord {
  id: PermissionId;
  status: PermissionStatus;
  grantedAt?: number;
  lastUsedAt?: number;
  purposeVersion: string;
}

const STORAGE_KEY = 'supernomad_permissions_v1';

function loadAll(): Record<PermissionId, PermissionRecord> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {} as Record<PermissionId, PermissionRecord>;
  }
}

function saveAll(records: Record<PermissionId, PermissionRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function setRecord(id: PermissionId, patch: Partial<PermissionRecord>) {
  const all = loadAll();
  all[id] = {
    id,
    purposeVersion: PURPOSE_VERSION,
    status: 'prompt',
    ...all[id],
    ...patch,
  };
  saveAll(all);
}

/* ───────────────────────── Consent ledger ───────────────────────── */

async function hashPurpose(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function logConsent(spec: PermissionSpec, granted: boolean) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      // Pre-auth users still get a local audit; backend logging happens after signup.
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('snomad_id')
      .eq('id', session.user.id)
      .maybeSingle();
    if (!profile?.snomad_id) return;

    await supabase.from('consent_ledger').insert({
      user_id: session.user.id,
      snomad_id: profile.snomad_id,
      purpose: `device_permission:${spec.id}`,
      granted,
      consent_text_hash: await hashPurpose(spec.purpose),
      consent_text_version: spec.purposeVersion,
      metadata: {
        category: spec.category,
        tier: spec.tier,
        gdpr_basis: spec.gdprBasis,
        platforms: spec.platforms,
      },
    });
  } catch (err) {
    console.warn('[PermissionService] consent log failed', err);
  }
}

/* ───────────────────────── Status checks ───────────────────────── */

async function nativeStatus(id: PermissionId): Promise<PermissionStatus> {
  // Web implementation — Capacitor native plugins replace these later.
  switch (id) {
    case 'location-when-in-use':
    case 'location-always': {
      if (!('geolocation' in navigator)) return 'unsupported';
      try {
        const result = await (navigator as any).permissions?.query?.({ name: 'geolocation' });
        if (!result) return 'prompt';
        return (result.state as PermissionStatus) ?? 'prompt';
      } catch {
        return 'prompt';
      }
    }
    case 'notifications': {
      if (!('Notification' in window)) return 'unsupported';
      const p = (window as any).Notification.permission as 'default' | 'granted' | 'denied';
      return p === 'default' ? 'prompt' : p;
    }
    case 'camera':
    case 'microphone': {
      if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
      try {
        const result = await (navigator as any).permissions?.query?.({
          name: id === 'camera' ? 'camera' : 'microphone',
        });
        return (result?.state as PermissionStatus) ?? 'prompt';
      } catch {
        return 'prompt';
      }
    }
    case 'biometrics': {
      // @ts-ignore
      if (!window.PublicKeyCredential) return 'unsupported';
      return 'prompt';
    }
    case 'calendar-read':
    case 'calendar-write':
    case 'contacts':
    case 'photos':
    case 'motion':
    case 'health':
    case 'bluetooth':
    case 'background-refresh':
    case 'phone-state':
      return 'unsupported'; // requires native — surfaced honestly
    case 'email-import-google':
    case 'email-import-microsoft':
    case 'email-forward':
    case 'storage-documents':
      return 'prompt';
    default:
      return 'prompt';
  }
}

export async function getStatus(id: PermissionId): Promise<PermissionStatus> {
  const stored = loadAll()[id];
  if (stored?.status === 'revoked') return 'revoked';
  return await nativeStatus(id);
}

export async function getAllStatuses(): Promise<Record<PermissionId, PermissionStatus>> {
  const out = {} as Record<PermissionId, PermissionStatus>;
  await Promise.all(
    PERMISSION_REGISTRY.map(async (p) => {
      out[p.id] = await getStatus(p.id);
    }),
  );
  return out;
}

/* ───────────────────────── Request flows ───────────────────────── */

export async function requestPermission(id: PermissionId): Promise<PermissionStatus> {
  const spec = getPermission(id);
  if (!spec) return 'unsupported';

  let status: PermissionStatus = 'prompt';

  switch (id) {
    case 'location-when-in-use':
    case 'location-always': {
      if (!('geolocation' in navigator)) {
        status = 'unsupported';
        break;
      }
      status = await new Promise<PermissionStatus>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve('granted'),
          (e) => resolve(e.code === 1 ? 'denied' : 'prompt'),
          { timeout: 10_000 },
        );
      });
      break;
    }
    case 'notifications': {
      if (!('Notification' in window)) {
        status = 'unsupported';
        break;
      }
      const result = await (window as any).Notification.requestPermission();
      status = result === 'default' ? 'prompt' : result;
      break;
    }
    case 'camera':
    case 'microphone': {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          id === 'camera' ? { video: true } : { audio: true },
        );
        stream.getTracks().forEach((t) => t.stop());
        status = 'granted';
      } catch {
        status = 'denied';
      }
      break;
    }
    default:
      status = 'unsupported';
  }

  setRecord(id, {
    status,
    grantedAt: status === 'granted' ? Date.now() : undefined,
  });
  await logConsent(spec, status === 'granted');
  return status;
}

export async function revokePermission(id: PermissionId): Promise<void> {
  const spec = getPermission(id);
  if (!spec) return;
  setRecord(id, { status: 'revoked', grantedAt: undefined });
  await logConsent(spec, false);
}

export function markUsed(id: PermissionId) {
  setRecord(id, { lastUsedAt: Date.now() });
}

export function getRecord(id: PermissionId): PermissionRecord | undefined {
  return loadAll()[id];
}
