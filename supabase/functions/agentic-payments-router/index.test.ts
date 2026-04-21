// Deno tests for the Agentic Payments shared library + router protocol logic.
// Run with: deno test --allow-net --allow-env

import { assert, assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  selectProtocol, generateIntentId,
  buildX402Required, encodeX402Required, decodeX402Required,
  buildMppChallenge, parseMppChallenge, buildMppCredential, buildMppReceipt,
  buildTapSignature, verifyTapSignature, getDemoSigningKey,
  issueVirtualCard,
} from "../_shared/agenticPayments.ts";

// ─── Protocol selector ────────────────────────────────────
Deno.test("selector: tiny api call → x402", () => {
  const q = selectProtocol({ amount: 0.05, currency: 'USD', category: 'api-call', description: 'weather data' });
  assertEquals(q.protocol, 'x402');
  assertEquals(q.cryptoNetwork, 'base');
});

Deno.test("selector: $300 hotel booking → visa-tap", () => {
  const q = selectProtocol({ amount: 300, currency: 'USD', category: 'booking', description: 'AirBnB Tokyo' });
  assertEquals(q.protocol, 'visa-tap');
  assert(q.trustScore >= 95);
});

Deno.test("selector: dining → mastercard-cloud", () => {
  const q = selectProtocol({ amount: 120, currency: 'USD', category: 'dining', description: 'Sushi Saito' });
  assertEquals(q.protocol, 'mastercard-cloud');
});

Deno.test("selector: $25 SaaS subscription → mpp", () => {
  const q = selectProtocol({ amount: 25, currency: 'USD', category: 'subscription', description: 'Linear seat' });
  assertEquals(q.protocol, 'mpp');
});

Deno.test("selector: respects preferredProtocol override", () => {
  const q = selectProtocol({
    amount: 500, currency: 'USD', category: 'booking', description: 'flight',
    preferredProtocol: 'stripe-issuing',
  });
  assertEquals(q.protocol, 'stripe-issuing');
});

// ─── Intent IDs ───────────────────────────────────────────
Deno.test("intent IDs are unique and prefixed", () => {
  const a = generateIntentId();
  const b = generateIntentId();
  assert(a.startsWith('SN-pay-'));
  assert(b.startsWith('SN-pay-'));
  assert(a !== b);
});

// ─── x402 v2 wire format ──────────────────────────────────
Deno.test("x402: PAYMENT-REQUIRED roundtrip", () => {
  const req = buildX402Required('https://api.example.com/data', 0.05, '0xabc');
  const encoded = encodeX402Required(req);
  const decoded = decodeX402Required(encoded);
  assertEquals(decoded.x402Version, 2);
  assertEquals(decoded.accepts[0].asset, 'USDC');
  // 0.05 USDC * 1e6 = 50000 atomic
  assertEquals(decoded.accepts[0].maxAmountRequired, '50000');
});

// ─── MPP challenge / credential / receipt ─────────────────
Deno.test("MPP: challenge round-trip", () => {
  const header = buildMppChallenge({
    id: 'abc123', realm: 'mpp.dev', method: 'tempo', intent: 'charge',
    amount: { value: '1.00', currency: 'USD' }, request: 'eyJ',
  });
  assert(header.startsWith('Payment '));
  const parsed = parseMppChallenge(header);
  assertEquals(parsed?.id, 'abc123');
  assertEquals(parsed?.method, 'tempo');
});

Deno.test("MPP: credential is base64url Authorization Payment header", () => {
  const cred = buildMppCredential('abc123', { signature: '0xdead' });
  assert(cred.startsWith('Payment '));
});

Deno.test("MPP: receipt is base64url-encoded JSON", () => {
  const r = buildMppReceipt('success', 'tx_xyz', { value: '5.00', currency: 'USD' });
  assert(typeof r === 'string' && r.length > 0);
});

// ─── Visa TAP (RFC 9421) ──────────────────────────────────
Deno.test("TAP: sign + verify HTTP message signature", async () => {
  const key = await getDemoSigningKey();
  const sig = await buildTapSignature({
    method: 'POST', authority: 'pay.supernomad.app', path: '/charge',
    keyId: 'sn-test', alg: 'hmac-sha256', agentIntent: 'commerce',
  }, key);

  assert(sig.signatureInput.startsWith('tap='));
  assert(sig.signature.startsWith('tap=:'));

  const ok = await verifyTapSignature({
    'signature-input': sig.signatureInput,
    'signature': sig.signature,
    'agent-intent': 'commerce',
  }, { method: 'POST', authority: 'pay.supernomad.app', path: '/charge' }, key);
  assertEquals(ok, true);
});

Deno.test("TAP: tampered signature fails verification", async () => {
  const key = await getDemoSigningKey();
  const sig = await buildTapSignature({
    method: 'POST', authority: 'pay.supernomad.app', path: '/charge',
    keyId: 'sn-test', alg: 'hmac-sha256', agentIntent: 'commerce',
  }, key);
  const ok = await verifyTapSignature({
    'signature-input': sig.signatureInput,
    'signature': sig.signature,
    'agent-intent': 'commerce',
  }, { method: 'POST', authority: 'pay.supernomad.app', path: '/refund' /* tampered */ }, key);
  assertEquals(ok, false);
});

// ─── Stripe Issuing virtual card (demo) ───────────────────
Deno.test("issueVirtualCard demo returns deterministic shape", async () => {
  const card = await issueVirtualCard({
    amount: 420, currency: 'USD', cardType: 'single-use', network: 'visa',
  }, 'demo');
  assertExists(card.cardToken);
  assertEquals(card.last4.length, 4);
  assertEquals(card.network, 'visa');
  assert(card.cardToken.startsWith('tok_demo_'));
});
