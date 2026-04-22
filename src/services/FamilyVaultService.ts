// FamilyVaultService — encrypted, multi-member household vault.
// Stores passports, visas, vaccinations and medical notes for every
// dependent (spouse, kids, elderly parents, special-needs wards).
//
// Storage: AES-256-GCM via secureStorage (device-bound). Data never
// leaves the device unless the user explicitly syncs to Snomad ID Vault.

import { encryptJson, decryptJson } from '@/utils/secureStorage';
import type {
  FamilyMember,
  FamilyPassport,
  FamilyVisa,
  FamilyVaccination,
} from '@/types/familyMember';

const STORAGE_KEY = 'sn_family_vault_enc_v1';

function uid() {
  return `fm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export async function listMembers(): Promise<FamilyMember[]> {
  const raw = localStorage.getItem(STORAGE_KEY);
  const decrypted = await decryptJson<FamilyMember[]>(raw);
  return Array.isArray(decrypted) ? decrypted : [];
}

async function persist(members: FamilyMember[]): Promise<void> {
  const blob = await encryptJson(members);
  localStorage.setItem(STORAGE_KEY, blob);
}

export async function upsertMember(
  member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
): Promise<FamilyMember> {
  const members = await listMembers();
  const existingIdx = member.id ? members.findIndex((m) => m.id === member.id) : -1;
  const now = nowIso();

  if (existingIdx >= 0) {
    const updated: FamilyMember = {
      ...members[existingIdx],
      ...member,
      id: members[existingIdx].id,
      updatedAt: now,
    };
    members[existingIdx] = updated;
    await persist(members);
    return updated;
  }

  const created: FamilyMember = {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    passports: [],
    visas: [],
    vaccinations: [],
    medicalNotes: [],
    ...member,
  };
  members.push(created);
  await persist(members);
  return created;
}

export async function deleteMember(memberId: string): Promise<void> {
  const members = await listMembers();
  await persist(members.filter((m) => m.id !== memberId));
}

// Generic add-doc helper
async function addDoc<K extends 'passports' | 'visas' | 'vaccinations'>(
  memberId: string,
  collection: K,
  doc: FamilyMember[K][number],
): Promise<FamilyMember | null> {
  const members = await listMembers();
  const idx = members.findIndex((m) => m.id === memberId);
  if (idx < 0) return null;
  const list = (members[idx][collection] as any[]) ?? [];
  members[idx] = {
    ...members[idx],
    [collection]: [...list, doc],
    updatedAt: nowIso(),
  } as FamilyMember;
  await persist(members);
  return members[idx];
}

async function removeDoc(
  memberId: string,
  collection: 'passports' | 'visas' | 'vaccinations' | 'medicalNotes',
  docId: string,
): Promise<FamilyMember | null> {
  const members = await listMembers();
  const idx = members.findIndex((m) => m.id === memberId);
  if (idx < 0) return null;
  const list = (members[idx][collection] as any[]) ?? [];
  members[idx] = {
    ...members[idx],
    [collection]: list.filter((d) => d.id !== docId),
    updatedAt: nowIso(),
  } as FamilyMember;
  await persist(members);
  return members[idx];
}

export const familyVault = {
  list: listMembers,
  upsert: upsertMember,
  remove: deleteMember,
  addPassport: (mid: string, p: FamilyPassport) => addDoc(mid, 'passports', p),
  addVisa: (mid: string, v: FamilyVisa) => addDoc(mid, 'visas', v),
  addVaccination: (mid: string, v: FamilyVaccination) => addDoc(mid, 'vaccinations', v),
  removePassport: (mid: string, id: string) => removeDoc(mid, 'passports', id),
  removeVisa: (mid: string, id: string) => removeDoc(mid, 'visas', id),
  removeVaccination: (mid: string, id: string) => removeDoc(mid, 'vaccinations', id),
  newId: uid,
};

// ─────────────────────────────────────────────────────────────────────
// Expiry alert engine — scans every member's docs and surfaces things
// that are about to expire so the household admin can act in time.
// ─────────────────────────────────────────────────────────────────────

export type ExpiryUrgency = 'expired' | 'critical' | 'warning' | 'notice' | 'ok';

export interface ExpiryAlert {
  memberId: string;
  memberName: string;
  relationship: string;
  docType: 'passport' | 'visa' | 'vaccination';
  docLabel: string;     // "Italian passport", "Yellow Fever certificate"
  expiryDate: string;
  daysUntilExpiry: number;
  urgency: ExpiryUrgency;
  actionHint: string;
}

const MS_PER_DAY = 86_400_000;

export function classifyUrgency(daysUntil: number): ExpiryUrgency {
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 7) return 'critical';
  if (daysUntil <= 30) return 'warning';
  if (daysUntil <= 90) return 'notice';
  return 'ok';
}

export function buildAlerts(
  members: FamilyMember[],
  today: Date = new Date(),
): ExpiryAlert[] {
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const alerts: ExpiryAlert[] = [];

  for (const m of members) {
    const baseInfo = {
      memberId: m.id,
      memberName: m.preferredName || m.fullName,
      relationship: m.relationship,
    };

    for (const p of m.passports ?? []) {
      if (!p.expiryDate) continue;
      const days = Math.floor(
        (new Date(p.expiryDate).getTime() - startOfToday.getTime()) / MS_PER_DAY,
      );
      const urgency = classifyUrgency(days);
      if (urgency === 'ok') continue;
      alerts.push({
        ...baseInfo,
        docType: 'passport',
        docLabel: `${p.country} passport`,
        expiryDate: p.expiryDate,
        daysUntilExpiry: days,
        urgency,
        actionHint:
          days < 0
            ? 'Renew immediately — many countries refuse entry on expired passports.'
            : days <= 180
              ? 'Most countries require 6 months validity beyond travel dates — renew soon.'
              : 'Schedule renewal within the next quarter.',
      });
    }

    for (const v of m.visas ?? []) {
      if (!v.expiryDate) continue;
      const days = Math.floor(
        (new Date(v.expiryDate).getTime() - startOfToday.getTime()) / MS_PER_DAY,
      );
      const urgency = classifyUrgency(days);
      if (urgency === 'ok') continue;
      alerts.push({
        ...baseInfo,
        docType: 'visa',
        docLabel: `${v.country} ${v.visaType} visa`,
        expiryDate: v.expiryDate,
        daysUntilExpiry: days,
        urgency,
        actionHint:
          days < 0
            ? 'Visa expired — overstay penalties may apply.'
            : 'Begin renewal / extension process now.',
      });
    }

    for (const v of m.vaccinations ?? []) {
      if (!v.expiryDate) continue;
      const days = Math.floor(
        (new Date(v.expiryDate).getTime() - startOfToday.getTime()) / MS_PER_DAY,
      );
      const urgency = classifyUrgency(days);
      if (urgency === 'ok') continue;
      alerts.push({
        ...baseInfo,
        docType: 'vaccination',
        docLabel: `${v.name}${v.certificateNumber ? ' (ICVP)' : ''}`,
        expiryDate: v.expiryDate,
        daysUntilExpiry: days,
        urgency,
        actionHint:
          v.name.toLowerCase().includes('yellow fever')
            ? 'Yellow Fever certificate is mandatory for entry to many African and South American countries.'
            : 'Book booster appointment with your travel doctor.',
      });
    }
  }

  // Sort: most urgent first, then soonest expiry
  const order: Record<ExpiryUrgency, number> = {
    expired: 0, critical: 1, warning: 2, notice: 3, ok: 4,
  };
  return alerts.sort((a, b) => {
    const oa = order[a.urgency] - order[b.urgency];
    return oa !== 0 ? oa : a.daysUntilExpiry - b.daysUntilExpiry;
  });
}
