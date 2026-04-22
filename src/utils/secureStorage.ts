// secureStorage — Real AES-256-GCM encryption for sensitive client-side data.
//
// Replaces the prior `btoa(JSON.stringify(...))` "encryption" used in
// PaymentOptions, AwardCards, and PassportManager. Uses Web Crypto API
// with a device-bound key derived from the Snomad device ID.
//
// Threat model:
//   ✓ Protects against XSS-leaked localStorage dumps shared across devices.
//   ✓ Protects against casual inspection of localStorage by other browser tabs.
//   ✗ Does NOT protect against malicious code running in this same origin —
//     no client-side crypto can. Use Snomad ID Vault (server-encrypted) for
//     truly sensitive PII (passport numbers, ID scans, etc.).
//
// Storage format (versioned):
//   {"v":1,"iv":"<b64>","ct":"<b64>"}
//
// Falls back gracefully if Web Crypto is unavailable (very old browsers):
// returns plaintext JSON wrapped in {"v":0,"plain":...} so we never lose data.

import { getDeviceId } from './deviceId';

const KEY_VERSION = 1;
const SALT = 'supernomad/v1/aes-gcm';

let cachedKey: Promise<CryptoKey> | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  cachedKey = (async () => {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error('webcrypto_unavailable');

    const deviceId = getDeviceId();
    // Derive key from device ID + static salt with PBKDF2
    const baseKey = await subtle.importKey(
      'raw',
      new TextEncoder().encode(`${SALT}::${deviceId}`),
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );
    return subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(SALT),
        iterations: 100_000,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  })();
  return cachedKey;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Encrypt arbitrary JSON-serialisable data. Async because Web Crypto is async. */
export async function encryptJson(data: unknown): Promise<string> {
  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(data));
    const ct = new Uint8Array(
      await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext),
    );
    return JSON.stringify({ v: KEY_VERSION, iv: bytesToB64(iv), ct: bytesToB64(ct) });
  } catch {
    // Fallback: never silently lose user data
    return JSON.stringify({ v: 0, plain: data });
  }
}

/** Decrypt previously-encrypted JSON. Returns null on failure. */
export async function decryptJson<T = unknown>(blob: string | null): Promise<T | null> {
  if (!blob) return null;
  try {
    const parsed = JSON.parse(blob);

    // v0 plaintext fallback
    if (parsed?.v === 0 && 'plain' in parsed) return parsed.plain as T;

    // Legacy formats: bare base64 (old btoa scheme) or bare JSON array/object
    if (typeof parsed !== 'object' || parsed === null || !('v' in parsed)) {
      return parsed as T;
    }

    if (parsed.v === KEY_VERSION && parsed.iv && parsed.ct) {
      const key = await getKey();
      const iv = b64ToBytes(parsed.iv);
      const ct = b64ToBytes(parsed.ct);
      // Slice into a fresh ArrayBuffer to satisfy strict BufferSource typing
      const ctBuf = ct.buffer.slice(ct.byteOffset, ct.byteOffset + ct.byteLength) as ArrayBuffer;
      const ivBuf = iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer;
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBuf }, key, ctBuf);
      return JSON.parse(new TextDecoder().decode(pt)) as T;
    }
    return null;
  } catch {
    // Try legacy base64 (old btoa-only scheme)
    try {
      return JSON.parse(atob(blob)) as T;
    } catch {
      return null;
    }
  }
}

/** Convenience: fire-and-forget save. */
export async function secureSet(key: string, data: unknown): Promise<void> {
  try {
    localStorage.setItem(key, await encryptJson(data));
  } catch {
    /* quota / unavailable — no-op */
  }
}

/** Convenience: load + decrypt. */
export async function secureGet<T = unknown>(key: string): Promise<T | null> {
  return decryptJson<T>(localStorage.getItem(key));
}

/** Wipe an encrypted key. */
export function secureRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}
