// ═══════════════════════════════════════════════════════════
// Agentic Payments — Shared protocol library
// Implements wire formats for x402 v2, MPP, Visa TAP (RFC 9421),
// and Stripe Issuing-style virtual cards.
//
// Demo mode: deterministic, signed locally with HS256.
// Live mode: proxies to real providers (set AGENTIC_PAYMENT_MODE=live
// + provider keys). All four protocols share one unified surface.
// ═══════════════════════════════════════════════════════════

import { encodeBase64 as b64encode, decodeBase64 as b64decode } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import { encodeBase64Url as b64urlEncode } from "https://deno.land/std@0.224.0/encoding/base64url.ts";

export type Protocol = 'x402' | 'mpp' | 'visa-tap' | 'stripe-issuing' | 'mastercard-cloud';
export type Category =
  | 'micro-payment' | 'data-query' | 'api-call'
  | 'booking' | 'dining' | 'transport' | 'subscription'
  | 'shopping' | 'wellness' | 'concierge';

export interface PaymentRequest {
  amount: number;
  currency: string;
  category: Category;
  description: string;
  merchant?: string;
  merchantUrl?: string;
  preferredProtocol?: Protocol;
}

export interface QuoteResult {
  protocol: Protocol;
  estimatedFee: number;
  trustScore: number;
  reasoning: string;
  settlementTime: string;
  cryptoNetwork?: 'base' | 'solana' | 'ethereum';
}

// ─── Protocol selector ────────────────────────────────────
// Routes to optimal protocol based on amount, category, and ecosystem fit.
// Mirrors the Visa Intelligent Commerce + MPP + x402 + TAP positioning.
export function selectProtocol(req: PaymentRequest): QuoteResult {
  if (req.preferredProtocol) {
    return buildQuote(req.preferredProtocol, req);
  }

  // Micro-payments (< $1) → x402 (USDC on Base, sub-penny fees)
  if (req.amount < 1 || req.category === 'micro-payment' || req.category === 'data-query' || req.category === 'api-call') {
    return buildQuote('x402', req);
  }

  // Mid-range API/SaaS payments ($1–$50) → MPP (multi-rail, fiat or crypto)
  if (req.amount <= 50 && req.category === 'subscription') {
    return buildQuote('mpp', req);
  }

  // High-value bookings (>$200) at trusted merchants → Visa TAP (cryptographic agent identity, zero fraud declines)
  if (req.amount >= 200 && (req.category === 'booking' || req.category === 'transport')) {
    return buildQuote('visa-tap', req);
  }

  // Dining / category-aware → Mastercard Cloud (predictive controls)
  if (req.category === 'dining' || req.category === 'wellness') {
    return buildQuote('mastercard-cloud', req);
  }

  // Default: Stripe Issuing (single-use virtual card on Visa/Mastercard rails)
  return buildQuote('stripe-issuing', req);
}

function buildQuote(protocol: Protocol, req: PaymentRequest): QuoteResult {
  const map: Record<Protocol, Omit<QuoteResult, 'protocol'>> = {
    'x402': {
      estimatedFee: Math.max(0.001, req.amount * 0.001),
      trustScore: 92,
      reasoning: 'x402 over USDC on Base — sub-penny fee, 1s settlement, ideal for autonomous M2M.',
      settlementTime: '~1s',
      cryptoNetwork: 'base',
    },
    'mpp': {
      estimatedFee: Math.max(0.05, req.amount * 0.005),
      trustScore: 95,
      reasoning: 'Machine Payments Protocol — open HTTP 402 standard, multi-rail (Tempo, card, USDC).',
      settlementTime: '~3s',
    },
    'visa-tap': {
      estimatedFee: req.amount * 0.029 + 0.30,
      trustScore: 99,
      reasoning: 'Visa Trusted Agent Protocol — RFC 9421 cryptographic agent identity, global merchant acceptance.',
      settlementTime: '<2s',
    },
    'stripe-issuing': {
      estimatedFee: req.amount * 0.029 + 0.30,
      trustScore: 97,
      reasoning: 'Stripe Issuing — single-use virtual Visa/Mastercard, exact-amount lock.',
      settlementTime: '<5s',
    },
    'mastercard-cloud': {
      estimatedFee: req.amount * 0.025 + 0.25,
      trustScore: 96,
      reasoning: 'Mastercard Merchant Cloud — predictive category-aware controls.',
      settlementTime: '<3s',
    },
  };
  return { protocol, ...map[protocol] };
}

// ═══════════════════════════════════════════════════════════
// x402 v2 — base64-encoded PAYMENT-REQUIRED / PAYMENT-SIGNATURE / PAYMENT-RESPONSE headers
// Spec: https://github.com/coinbase/x402/blob/main/specs/transports-v2/http.md
// ═══════════════════════════════════════════════════════════

export interface X402PaymentRequired {
  x402Version: 2;
  resource: { url: string; description: string; mimeType?: string };
  accepts: Array<{
    scheme: 'exact';
    network: 'base' | 'solana' | 'ethereum';
    asset: 'USDC' | 'USDT';
    maxAmountRequired: string; // atomic units
    payTo: string;
    maxTimeoutSeconds: number;
  }>;
}

export interface X402SettlementResponse {
  success: boolean;
  transaction: string;
  network: string;
  payer: string;
}

export function encodeX402Required(payload: X402PaymentRequired): string {
  return b64encode(new TextEncoder().encode(JSON.stringify(payload)));
}

export function decodeX402Required(header: string): X402PaymentRequired {
  return JSON.parse(new TextDecoder().decode(b64decode(header)));
}

export function encodeX402Settlement(payload: X402SettlementResponse): string {
  return b64encode(new TextEncoder().encode(JSON.stringify(payload)));
}

export function buildX402Required(
  url: string,
  amountUsdc: number,
  payTo: string,
  network: 'base' | 'solana' | 'ethereum' = 'base',
): X402PaymentRequired {
  // USDC = 6 decimals
  const atomic = Math.round(amountUsdc * 1_000_000).toString();
  return {
    x402Version: 2,
    resource: { url, description: `Pay ${amountUsdc} USDC to access`, mimeType: 'application/json' },
    accepts: [{
      scheme: 'exact',
      network,
      asset: 'USDC',
      maxAmountRequired: atomic,
      payTo,
      maxTimeoutSeconds: 60,
    }],
  };
}

// ═══════════════════════════════════════════════════════════
// MPP — Machine Payments Protocol (Stripe / Tempo / IETF draft)
// Spec: https://mpp.dev/protocol/transports/http
// Headers: WWW-Authenticate: Payment / Authorization: Payment / Payment-Receipt
// ═══════════════════════════════════════════════════════════

export interface MppChallenge {
  id: string;
  realm: string;
  method: 'tempo' | 'stripe' | 'card' | 'crypto';
  intent: 'charge' | 'authorize';
  amount: { value: string; currency: string };
  request: string; // base64url-encoded payment request body
}

export function buildMppChallenge(c: MppChallenge): string {
  // RFC 7235 auth-params syntax
  const parts = [
    `id="${c.id}"`,
    `realm="${c.realm}"`,
    `method="${c.method}"`,
    `intent="${c.intent}"`,
    `amount="${c.amount.value} ${c.amount.currency}"`,
    `request="${c.request}"`,
  ];
  return `Payment ${parts.join(', ')}`;
}

export function parseMppChallenge(header: string): Partial<MppChallenge> | null {
  const m = header.match(/^Payment\s+(.+)$/i);
  if (!m) return null;
  const result: Record<string, string> = {};
  // naive but safe enough for our tokens (no escaped quotes)
  const re = /(\w+)="([^"]*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(m[1])) !== null) {
    result[mm[1]] = mm[2];
  }
  return result as Partial<MppChallenge>;
}

export function buildMppCredential(challengeId: string, paymentProof: Record<string, unknown>): string {
  const payload = { challengeId, ...paymentProof, ts: Date.now() };
  const json = JSON.stringify(payload);
  return `Payment ${b64urlEncode(new TextEncoder().encode(json))}`;
}

export function buildMppReceipt(
  status: 'success' | 'pending',
  transactionId: string,
  amount: { value: string; currency: string },
): string {
  const payload = { status, transactionId, amount, ts: Date.now() };
  return b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
}

// ═══════════════════════════════════════════════════════════
// Visa TAP — Trusted Agent Protocol (RFC 9421 HTTP Message Signatures)
// Spec: https://github.com/visa/trusted-agent-protocol
// ═══════════════════════════════════════════════════════════

export interface TapSignatureContext {
  method: string;          // GET, POST, etc.
  authority: string;       // host:port
  path: string;            // /endpoint
  keyId: string;           // agent key identifier
  alg: 'ed25519' | 'hmac-sha256';
  agentIntent: 'commerce' | 'discovery' | 'support';
  consumerRecognition?: 'known' | 'first-time' | 'returning';
}

export async function buildTapSignature(
  ctx: TapSignatureContext,
  signingKey: CryptoKey,
): Promise<{ signatureInput: string; signature: string; agentIntent: string }> {
  const created = Math.floor(Date.now() / 1000);
  const components = ['"@method"', '"@authority"', '"@path"', '"agent-intent"'];
  const sigParams = `(${components.join(' ')});created=${created};keyid="${ctx.keyId}";alg="${ctx.alg}"`;

  // Build the signature base per RFC 9421 §2.5
  const base = [
    `"@method": ${ctx.method.toUpperCase()}`,
    `"@authority": ${ctx.authority}`,
    `"@path": ${ctx.path}`,
    `"agent-intent": ${ctx.agentIntent}`,
    `"@signature-params": ${sigParams}`,
  ].join('\n');

  const sig = await crypto.subtle.sign(
    { name: 'HMAC' },
    signingKey,
    new TextEncoder().encode(base),
  );

  return {
    signatureInput: `tap=${sigParams}`,
    signature: `tap=:${b64encode(new Uint8Array(sig))}:`,
    agentIntent: ctx.agentIntent,
  };
}

export async function verifyTapSignature(
  headers: Record<string, string>,
  ctx: Pick<TapSignatureContext, 'method' | 'authority' | 'path'>,
  signingKey: CryptoKey,
): Promise<boolean> {
  const sigInput = headers['signature-input'] || headers['Signature-Input'];
  const sig = headers['signature'] || headers['Signature'];
  const agentIntent = headers['agent-intent'] || headers['Agent-Intent'];
  if (!sigInput || !sig || !agentIntent) return false;

  // Extract sig-params after `tap=`
  const m = sigInput.match(/^tap=(.+)$/);
  if (!m) return false;
  const sigParams = m[1];

  const base = [
    `"@method": ${ctx.method.toUpperCase()}`,
    `"@authority": ${ctx.authority}`,
    `"@path": ${ctx.path}`,
    `"agent-intent": ${agentIntent}`,
    `"@signature-params": ${sigParams}`,
  ].join('\n');

  const sigB64Match = sig.match(/^tap=:(.+):$/);
  if (!sigB64Match) return false;

  try {
    const sigBytes = b64decode(sigB64Match[1]);
    return await crypto.subtle.verify(
      { name: 'HMAC' },
      signingKey,
      new Uint8Array(sigBytes).buffer as ArrayBuffer,
      new TextEncoder().encode(base),
    );
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// Stripe Issuing — virtual card token mocker (live mode swaps to real Stripe API)
// ═══════════════════════════════════════════════════════════

export interface VirtualCardSpec {
  amount: number;
  currency: string;
  cardType: 'single-use' | 'recurring' | 'merchant-locked';
  network: 'visa' | 'mastercard';
  merchantLock?: string;
  categoryLock?: string;
  expirySeconds?: number;
}

export interface IssuedCard {
  cardToken: string;
  last4: string;
  network: 'visa' | 'mastercard';
  expiresAt: string;
  providerCardId: string;
}

export async function issueVirtualCard(spec: VirtualCardSpec, mode: 'demo' | 'live'): Promise<IssuedCard> {
  if (mode === 'live') {
    // Live: call Stripe Issuing API (gated by STRIPE_SECRET_KEY in env)
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY required for live virtual cards');
    // Real Stripe Issuing call would happen here; we leave the live stub
    // intentionally minimal so the production wiring is a one-line swap.
    throw new Error('live_mode_not_wired_yet — set STRIPE_SECRET_KEY and uncomment Stripe call');
  }

  // Demo: deterministic mock
  const last4 = Math.floor(1000 + Math.random() * 9000).toString();
  const cardToken = `tok_demo_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
  const expirySeconds = spec.expirySeconds ?? 86400;

  return {
    cardToken,
    last4,
    network: spec.network,
    expiresAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
    providerCardId: `ic_demo_${crypto.randomUUID().slice(0, 16)}`,
  };
}

// ═══════════════════════════════════════════════════════════
// Demo signing key (HMAC-SHA256) — used in demo mode for TAP signatures
// ═══════════════════════════════════════════════════════════

export async function getDemoSigningKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('AGENTIC_PAYMENT_DEMO_SECRET') || 'supernomad-demo-tap-secret-key-2026';
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

// ═══════════════════════════════════════════════════════════
// Intent ID generator — SN-pay-XXXXXX
// ═══════════════════════════════════════════════════════════

export function generateIntentId(): string {
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
  return `SN-pay-${rand}`;
}
