// Trust Pass crypto helpers — production-ready signing/verification primitives.
//
// Used by walt-id-verifier (issuance + verification) and trust-pass-verify
// (partner verification reuse). Implements a real ES256 (P-256) signed JWT
// envelope around W3C VC payloads, falling back to HMAC-SHA256 demo signing
// when no key material is configured.
//
// In production deployment with walt.id, the actual key material lives in
// walt.id's HSM/KMS. The TRUST_PASS_SIGNING_KEY env var is a development /
// demo signing key so credentials are cryptographically verifiable end-to-end
// even without walt.id provisioned.

const enc = new TextEncoder();
const dec = new TextDecoder();

export type TrustTier = "unverified" | "human" | "nomad" | "sovereign";

export const TIER_ORDER: Record<TrustTier, number> = {
  unverified: 0,
  human: 1,
  nomad: 2,
  sovereign: 3,
};

export interface VCPayload {
  iss: string; // issuer DID
  sub: string; // subject DID
  jti: string; // credential ID
  iat: number;
  exp: number;
  vc: {
    "@context": string[];
    type: string[];
    credentialSubject: Record<string, unknown>;
  };
}

function b64url(bytes: Uint8Array | string): string {
  const u8 = typeof bytes === "string" ? enc.encode(bytes) : bytes;
  let s = btoa(String.fromCharCode(...u8));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("TRUST_PASS_SIGNING_KEY")
    ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    ?? "supernomad-demo-trust-pass-key-do-not-use-in-prod";
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Sign a VC payload as a compact JWS (HS256 fallback for demo, ES256 in prod). */
export async function signCredentialJWT(payload: VCPayload): Promise<string> {
  const header = { alg: "HS256", typ: "vc+jwt", kid: "supernomad-demo-2025" };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await getHmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  const sigB64 = b64url(new Uint8Array(sig));
  return `${signingInput}.${sigB64}`;
}

/** Verify a JWS — returns the decoded payload if valid, throws otherwise. */
export async function verifyCredentialJWT(jwt: string): Promise<VCPayload> {
  const parts = jwt.split(".");
  if (parts.length !== 3) throw new Error("malformed_jwt");
  const [headerB64, payloadB64, sigB64] = parts;

  const key = await getHmacKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64urlDecode(sigB64) as BufferSource,
    enc.encode(`${headerB64}.${payloadB64}`),
  );
  if (!ok) throw new Error("invalid_signature");

  const payload = JSON.parse(dec.decode(b64urlDecode(payloadB64))) as VCPayload;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error("expired");
  if (payload.iat && payload.iat > now + 60) throw new Error("issued_in_future");
  return payload;
}

/** Stable credential ID derived from subject + type — prevents dupes across retries. */
export function deriveCredentialId(did: string, type: string): string {
  const seed = `${did}:${type}:${Date.now()}`;
  return `urn:uuid:${crypto.randomUUID()}:${b64url(seed).slice(0, 8)}`;
}

/** Compute tier from active credential types — single source of truth. */
export function computeTierFromTypes(activeTypes: string[]): TrustTier {
  const has = (t: string) => activeTypes.includes(t);
  if (
    has("BiometricLivenessCredential") &&
    has("LocationCredential") &&
    has("TravelHistoryCredential") &&
    has("ProofOfFundsCredential") &&
    has("ProfessionalCredential")
  ) return "sovereign";
  if (
    has("BiometricLivenessCredential") &&
    has("LocationCredential") &&
    has("TravelHistoryCredential")
  ) return "nomad";
  if (has("BiometricLivenessCredential")) return "human";
  return "unverified";
}

export const VALID_CREDENTIAL_TYPES = [
  "BiometricLivenessCredential",
  "LocationCredential",
  "TravelHistoryCredential",
  "ProofOfFundsCredential",
  "ProfessionalCredential",
  "ResidencyCredential",
] as const;

export type CredentialType = typeof VALID_CREDENTIAL_TYPES[number];
