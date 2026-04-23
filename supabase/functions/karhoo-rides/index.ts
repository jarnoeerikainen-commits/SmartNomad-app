// karhoo-rides
// ─────────────
// Backend-ready Karhoo aggregator integration.
//
// Demo mode (default — no KARHOO_API_KEY): returns { demo: true } so the
// client falls back to its built-in demo quote generator. Everything still
// works for the user — they just don't hit a real API.
//
// Production mode: set the secrets below and this function transparently
// proxies the SuperNomad Concierge to the real Karhoo Demand API:
//   - KARHOO_API_KEY        (X-API-Key header)
//   - KARHOO_API_BASE       (e.g. https://rest.sandbox.karhoo.com/v1)
//   - KARHOO_USERNAME       (optional, for token-auth tenants)
//   - KARHOO_PASSWORD       (optional)
//
// Endpoints implemented:
//   action=quotes  → POST /quotes  (immediate or scheduled)
//   action=book    → POST /bookings
//
// Karhoo docs: https://developer.karhoo.com

import { corsHeaders } from "https://esm.sh/@supabase/[email protected]/cors";

interface QuoteRequest {
  pickup: { lat?: number; lng?: number; address: string; city?: string };
  dropoff: { lat?: number; lng?: number; address: string };
  whenISO?: string;
  pax?: number;
}

interface BookRequest {
  quoteId: string;
  pickup: { address: string; lat?: number; lng?: number };
  dropoff: { address: string; lat?: number; lng?: number };
  whenISO?: string;
  passenger: { name: string; phone?: string };
  paymentMethodId?: string;
}

const KARHOO_KEY = Deno.env.get("KARHOO_API_KEY");
const KARHOO_BASE = Deno.env.get("KARHOO_API_BASE") ?? "https://rest.sandbox.karhoo.com/v1";

async function karhooFetch(path: string, init: RequestInit) {
  const res = await fetch(`${KARHOO_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": KARHOO_KEY!,
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    throw new Error(`Karhoo ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

// Map Karhoo API response → our RideQuote shape
// (Real Karhoo returns { quote_items: [...] }; we normalise here)
function normalizeQuotes(karhooResp: any): unknown[] {
  const items = karhooResp?.quote_items || karhooResp?.quotes || [];
  return items.map((it: any) => ({
    quoteId: it.quote_id || it.id,
    supplier: it.fleet_name || it.supplier?.name || "Karhoo",
    vehicleClass: (it.vehicle_class || it.category || "standard").toLowerCase(),
    vehicleName: it.vehicle?.description || it.vehicle_class || "Vehicle",
    etaMinutes: Math.round((it.eta_seconds || 300) / 60),
    durationMinutes: Math.round((it.duration_seconds || 1080) / 60),
    priceLow: it.price?.low ?? it.price?.value ?? 0,
    priceHigh: it.price?.high ?? it.price?.value ?? 0,
    currency: it.price?.currency || "EUR",
    capacityPax: it.vehicle?.passenger_capacity || 4,
    capacityBags: it.vehicle?.luggage_capacity || 2,
    cancellationFreeMinutes: it.cancellation?.free_until_minutes || 5,
    fixedPrice: it.price?.type === "FIXED",
    ecoFriendly: it.vehicle?.tags?.includes?.("electric") || false,
    rating: it.fleet?.rating || 4.5,
  }));
}

function normalizeBooking(karhooResp: any): unknown {
  return {
    bookingId: karhooResp.id || karhooResp.booking_id,
    status: (karhooResp.status || "confirmed").toLowerCase(),
    supplier: karhooResp.fleet_info?.name || "Karhoo",
    vehicleName: karhooResp.vehicle?.description || "Vehicle",
    driverName: karhooResp.driver?.first_name
      ? `${karhooResp.driver.first_name} ${karhooResp.driver.last_name || ""}`.trim()
      : undefined,
    driverPhone: karhooResp.driver?.phone_number,
    driverRating: karhooResp.driver?.rating,
    vehiclePlate: karhooResp.vehicle?.licence_plate,
    vehicleColor: karhooResp.vehicle?.colour,
    etaMinutes: Math.round((karhooResp.eta_seconds || 300) / 60),
    trackingUrl: karhooResp.tracking_url,
    pricePaid: karhooResp.quote?.total,
    currency: karhooResp.quote?.currency || "EUR",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const action = body?.action;

    // ─── Demo mode: no key set ─────────────────────────────────
    if (!KARHOO_KEY) {
      return new Response(JSON.stringify({ demo: true, reason: "KARHOO_API_KEY not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ─── Production: real Karhoo calls ─────────────────────────
    if (action === "quotes") {
      const r: QuoteRequest = body.request;
      const payload = {
        origin: r.pickup.lat && r.pickup.lng
          ? { latitude: r.pickup.lat, longitude: r.pickup.lng, display_address: r.pickup.address }
          : { display_address: r.pickup.address },
        destination: r.dropoff.lat && r.dropoff.lng
          ? { latitude: r.dropoff.lat, longitude: r.dropoff.lng, display_address: r.dropoff.address }
          : { display_address: r.dropoff.address },
        date_scheduled: r.whenISO,
        passengers: r.pax || 1,
      };
      const data = await karhooFetch("/quotes", { method: "POST", body: JSON.stringify(payload) });
      return new Response(JSON.stringify({ quotes: normalizeQuotes(data) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "book") {
      const r: BookRequest = body.request;
      const payload = {
        quote_id: r.quoteId,
        passengers: {
          additional_passengers: 0,
          passenger_details: [{
            first_name: r.passenger.name.split(" ")[0],
            last_name: r.passenger.name.split(" ").slice(1).join(" ") || "Member",
            phone_number: r.passenger.phone,
          }],
        },
        payment_nonce: r.paymentMethodId,
      };
      const data = await karhooFetch("/bookings", { method: "POST", body: JSON.stringify(payload) });
      return new Response(JSON.stringify({ booking: normalizeBooking(data) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[karhoo-rides] error:", msg);
    return new Response(JSON.stringify({ error: msg, demo: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // return 200 so the client falls back gracefully
    });
  }
});
