// Pure unit tests — no network, no Supabase. Validates the crypto + tier logic
// that backs every Trust Pass credential. Run with `deno test --allow-env`.

import { assert, assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  computeTierFromTypes,
  deriveCredentialId,
  signCredentialJWT,
  verifyCredentialJWT,
  VALID_CREDENTIAL_TYPES,
  type VCPayload,
} from "../_shared/trustPassCrypto.ts";

function makePayload(overrides: Partial<VCPayload> = {}): VCPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    iss: "did:web:supernomad.app",
    sub: "did:key:z6MkTest",
    jti: "urn:uuid:test-1",
    iat: now,
    exp: now + 3600,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "BiometricLivenessCredential"],
      credentialSubject: { id: "did:key:z6MkTest", liveness: true },
    },
    ...overrides,
  };
}

Deno.test("signCredentialJWT produces a 3-part compact JWS", async () => {
  const jwt = await signCredentialJWT(makePayload());
  const parts = jwt.split(".");
  assertEquals(parts.length, 3);
  parts.forEach((p) => assert(p.length > 0, "segment must be non-empty"));
});

Deno.test("verifyCredentialJWT round-trips a signed credential", async () => {
  const payload = makePayload();
  const jwt = await signCredentialJWT(payload);
  const decoded = await verifyCredentialJWT(jwt);
  assertEquals(decoded.jti, payload.jti);
  assertEquals(decoded.sub, payload.sub);
  assertEquals(decoded.vc.type, payload.vc.type);
});

Deno.test("verifyCredentialJWT rejects tampered payload", async () => {
  const jwt = await signCredentialJWT(makePayload());
  const [h, , s] = jwt.split(".");
  const tamperedPayload = btoa(JSON.stringify({ ...makePayload(), sub: "did:key:attacker" }))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const tampered = `${h}.${tamperedPayload}.${s}`;
  await assertRejects(() => verifyCredentialJWT(tampered), Error, "invalid_signature");
});

Deno.test("verifyCredentialJWT rejects expired credentials", async () => {
  const past = Math.floor(Date.now() / 1000) - 7200;
  const jwt = await signCredentialJWT(makePayload({ iat: past - 3600, exp: past }));
  await assertRejects(() => verifyCredentialJWT(jwt), Error, "expired");
});

Deno.test("verifyCredentialJWT rejects malformed JWT", async () => {
  await assertRejects(() => verifyCredentialJWT("not.a.jwt.at.all"), Error, "malformed_jwt");
  await assertRejects(() => verifyCredentialJWT("only.two"), Error, "malformed_jwt");
});

Deno.test("computeTierFromTypes — unverified", () => {
  assertEquals(computeTierFromTypes([]), "unverified");
  assertEquals(computeTierFromTypes(["LocationCredential"]), "unverified");
});

Deno.test("computeTierFromTypes — human", () => {
  assertEquals(computeTierFromTypes(["BiometricLivenessCredential"]), "human");
});

Deno.test("computeTierFromTypes — nomad requires biometric + location + travel", () => {
  assertEquals(
    computeTierFromTypes([
      "BiometricLivenessCredential",
      "LocationCredential",
      "TravelHistoryCredential",
    ]),
    "nomad",
  );
});

Deno.test("computeTierFromTypes — sovereign requires all 5 core credentials", () => {
  assertEquals(
    computeTierFromTypes([
      "BiometricLivenessCredential",
      "LocationCredential",
      "TravelHistoryCredential",
      "ProofOfFundsCredential",
      "ProfessionalCredential",
    ]),
    "sovereign",
  );
});

Deno.test("deriveCredentialId returns urn:uuid format", () => {
  const id = deriveCredentialId("did:key:test", "BiometricLivenessCredential");
  assert(id.startsWith("urn:uuid:"), `expected urn:uuid prefix, got ${id}`);
});

Deno.test("VALID_CREDENTIAL_TYPES contains all 6 types", () => {
  assertEquals(VALID_CREDENTIAL_TYPES.length, 6);
  assert(VALID_CREDENTIAL_TYPES.includes("BiometricLivenessCredential"));
  assert(VALID_CREDENTIAL_TYPES.includes("ProofOfFundsCredential"));
});
