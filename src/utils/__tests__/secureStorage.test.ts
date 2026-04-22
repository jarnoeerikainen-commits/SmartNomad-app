/**
 * @vitest-environment jsdom
 *
 * Tests for AES-256-GCM secureStorage helpers. Uses Node's webcrypto polyfill
 * via jsdom (Node 20+ exposes `crypto.subtle` globally).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { encryptJson, decryptJson, secureSet, secureGet, secureRemove } from '../secureStorage';

beforeEach(() => {
  localStorage.clear();
  // The cached key is module-scoped; reset by re-importing not needed here
  // because we use the same device id through the entire test file.
});

describe('secureStorage', () => {
  it('round-trips an object through encryptJson → decryptJson', async () => {
    const data = { passport: 'X1234567', country: 'EE', issued: 2024 };
    const blob = await encryptJson(data);
    expect(typeof blob).toBe('string');
    // Should be a JSON envelope, not raw plaintext
    const parsed = JSON.parse(blob);
    expect(parsed.v).toBe(1);
    expect(parsed.iv).toBeTruthy();
    expect(parsed.ct).toBeTruthy();
    // Ciphertext must NOT contain the plaintext
    expect(blob).not.toContain('X1234567');

    const decoded = await decryptJson<typeof data>(blob);
    expect(decoded).toEqual(data);
  });

  it('decrypts the legacy bare-base64 format (backwards compat)', async () => {
    const legacy = btoa(JSON.stringify({ legacy: true, n: 7 }));
    const decoded = await decryptJson<{ legacy: boolean; n: number }>(legacy);
    expect(decoded).toEqual({ legacy: true, n: 7 });
  });

  it('returns null for null/empty input', async () => {
    expect(await decryptJson(null)).toBeNull();
  });

  it('secureSet + secureGet round-trip via localStorage', async () => {
    const data = { cards: [{ last4: '4242', brand: 'visa' }] };
    await secureSet('test:cards', data);
    const raw = localStorage.getItem('test:cards');
    expect(raw).toBeTruthy();
    expect(raw).not.toContain('4242'); // Encrypted at rest
    const back = await secureGet<typeof data>('test:cards');
    expect(back).toEqual(data);
  });

  it('secureRemove wipes the key', async () => {
    await secureSet('test:wipe', { x: 1 });
    expect(localStorage.getItem('test:wipe')).toBeTruthy();
    secureRemove('test:wipe');
    expect(localStorage.getItem('test:wipe')).toBeNull();
  });

  it('produces different ciphertexts for same plaintext (random IV)', async () => {
    const a = await encryptJson({ same: 'data' });
    const b = await encryptJson({ same: 'data' });
    expect(a).not.toBe(b);
  });
});
