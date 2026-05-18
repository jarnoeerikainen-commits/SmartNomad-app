/**
 * providerAdapter.ts — Uniform demo/live switch for every external API
 * ---------------------------------------------------------------------
 * Pattern: every edge function that calls a third-party service uses
 * `callProvider()` so flipping demo→live is a one-line change + a secret.
 *
 *   import { callProvider } from "../_shared/providerAdapter.ts";
 *
 *   const result = await callProvider({
 *     integrationKey: "rides",
 *     providerId: "karhoo",
 *     demo: () => ({ quote: 42, currency: "EUR", source: "demo" }),
 *     live: async ({ secrets, fetch }) => {
 *       const r = await fetch("https://rest.karhoo.com/v2/quotes", {
 *         headers: { Authorization: `Bearer ${secrets.KARHOO_API_KEY}` },
 *       });
 *       return await r.json();
 *     },
 *   });
 *
 * The adapter:
 *   • Reads required secret names from the registry mirror below.
 *   • Falls back to demo() when ANY required secret is missing OR when
 *     APP_FORCE_DEMO=1 is set.
 *   • Tags every payload with `{ _source: "live"|"demo", _provider }` so
 *     the UI / Concierge can flag demo data (Evidence-First memory).
 *   • Wraps fetch with timeout, retries (exponential), and error capture.
 */

// Tiny mirror of registry.ts so edge runtime doesn't import frontend code.
// Keep in sync — CI guard recommended.
const PROVIDER_SECRETS: Record<string, Record<string, string[]>> = {
  "rides":                 { karhoo: ["KARHOO_API_KEY", "KARHOO_SECRET"], uber: ["UBER_CLIENT_ID", "UBER_CLIENT_SECRET"], lyft: ["LYFT_CLIENT_ID", "LYFT_CLIENT_SECRET"] },
  "flights":               { duffel: ["DUFFEL_API_KEY"], amadeus: ["AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET"], "kiwi-tequila": ["KIWI_API_KEY"] },
  "hotels":                { "amadeus-hotel": ["AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET"], "booking-affiliate": ["BOOKING_AFFILIATE_ID"], hotelbeds: ["HOTELBEDS_API_KEY", "HOTELBEDS_SECRET"] },
  "air-charter":           { paramount: ["PARAMOUNT_API_KEY"], jettly: ["JETTLY_API_KEY"], avinode: ["AVINODE_CLIENT_ID", "AVINODE_CLIENT_SECRET"] },
  "reservation-booking":   { tock: ["TOCK_API_KEY"], resy: ["RESY_API_KEY"], opentable: ["OPENTABLE_API_KEY", "OPENTABLE_RID"], sevenrooms: ["SEVENROOMS_API_KEY"] },
  "stripe-issuing":        { stripe: ["STRIPE_SECRET_KEY"] },
  "x402":                  { "coinbase-x402": ["X402_API_KEY", "X402_FACILITATOR_URL"] },
  "usdc-base":             { "coinbase-cdp": ["CDP_API_KEY", "CDP_API_SECRET"] },
  "twilio-voice":          { twilio: ["TWILIO_API_KEY", "TWILIO_PHONE_NUMBER", "LOVABLE_API_KEY"] },
  "resend-email":          { resend: ["RESEND_API_KEY"] },
  "telegram-bot":          { "telegram-bot-api": ["TELEGRAM_BOT_TOKEN"] },
  "walt-id":               { "walt-id": ["WALT_ID_API_KEY", "WALT_ID_TENANT"] },
  "kyc-liveness":          { persona: ["PERSONA_API_KEY"], onfido: ["ONFIDO_API_KEY"], sumsub: ["SUMSUB_APP_TOKEN", "SUMSUB_SECRET"] },
  "air-quality":           { waqi: ["WAQI_TOKEN"] },
  "maps-places":           { mapbox: ["MAPBOX_TOKEN"], "google-places": ["GOOGLE_PLACES_API_KEY"], foursquare: ["FSQ_API_KEY"] },
  "ip-geo":                { ipinfo: ["IPINFO_TOKEN"], ipapi: [] },
  "visa-rules":            { sherpa: ["SHERPA_API_KEY"], ivisa: ["IVISA_API_KEY"] },
  "esim":                  { airalo: ["AIRALO_CLIENT_ID", "AIRALO_CLIENT_SECRET"], gigsky: ["GIGSKY_API_KEY"] },
  "travel-insurance":      { safetywing: ["SAFETYWING_PARTNER_ID"], genki: ["GENKI_PARTNER_ID"] },
  "threat-intel":          { crisis24: ["CRISIS24_API_KEY"] },
  "liveavatar":            { heygen: ["HEYGEN_API_KEY"] },
  "ai-gateway":            { "lovable-ai-gateway": ["LOVABLE_API_KEY"] },
  "elevenlabs-tts":        { elevenlabs: ["ELEVENLABS_API_KEY"] },
};

export interface AdapterContext {
  secrets: Record<string, string>;
  fetch: typeof fetch;
}

export interface AdapterOptions<T> {
  integrationKey: string;
  providerId: string;
  /** Returns demo data when secrets missing OR force-demo flag set. */
  demo: () => T | Promise<T>;
  /** Live implementation. Only called when all secrets resolve. */
  live: (ctx: AdapterContext) => Promise<T>;
  /** Optional per-call timeout in ms (default 15s). */
  timeoutMs?: number;
  /** Optional retry count for transient 5xx (default 1). */
  retries?: number;
}

export interface AdapterResult<T> {
  data: T;
  _source: "live" | "demo";
  _provider: string;
  _integration: string;
  _latencyMs: number;
  _error?: string;
}

const isForceDemo = () => Deno.env.get("APP_FORCE_DEMO") === "1";

export async function callProvider<T>(opts: AdapterOptions<T>): Promise<AdapterResult<T>> {
  const started = performance.now();
  const required = PROVIDER_SECRETS[opts.integrationKey]?.[opts.providerId] ?? [];
  const secrets: Record<string, string> = {};
  for (const name of required) {
    const v = Deno.env.get(name);
    if (v) secrets[name] = v;
  }
  const missing = required.filter((n) => !secrets[n]);

  if (FORCE_DEMO || missing.length > 0) {
    const data = await opts.demo();
    return {
      data,
      _source: "demo",
      _provider: opts.providerId,
      _integration: opts.integrationKey,
      _latencyMs: Math.round(performance.now() - started),
      _error: missing.length ? `missing_secrets:${missing.join(",")}` : undefined,
    };
  }

  const timeoutMs = opts.timeoutMs ?? 15_000;
  const retries = Math.max(0, opts.retries ?? 1);

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const wrappedFetch: typeof fetch = (input, init = {}) =>
        fetch(input, { ...init, signal: ctrl.signal });
      const data = await opts.live({ secrets, fetch: wrappedFetch });
      clearTimeout(t);
      return {
        data,
        _source: "live",
        _provider: opts.providerId,
        _integration: opts.integrationKey,
        _latencyMs: Math.round(performance.now() - started),
      };
    } catch (err) {
      clearTimeout(t);
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
      }
    }
  }

  // Live failed → degrade to demo with error tag.
  const data = await opts.demo();
  return {
    data,
    _source: "demo",
    _provider: opts.providerId,
    _integration: opts.integrationKey,
    _latencyMs: Math.round(performance.now() - started),
    _error: lastErr instanceof Error ? lastErr.message : String(lastErr),
  };
}

/** Quick check used by /v1/info-style endpoints. */
export function integrationStatus(integrationKey: string): Record<string, "live" | "missing"> {
  const providers = PROVIDER_SECRETS[integrationKey] ?? {};
  const out: Record<string, "live" | "missing"> = {};
  for (const [providerId, names] of Object.entries(providers)) {
    out[providerId] = names.every((n) => Deno.env.get(n)) ? "live" : "missing";
  }
  return out;
}
