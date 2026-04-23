// Demo expense seeds — deterministic, professional business-traveller datasets
// for Meghan (jet-setting C-suite consultant) and John (relocating expat exec).
// Used only when a demo persona is active. Never written to Supabase.

import type { ExpenseRow, ExpenseCategory } from "@/services/ExpenseHubService";

type Seed = {
  daysAgo: number;
  vendor: string;
  country: string;        // ISO-2
  category: ExpenseCategory;
  amount: number;
  currency: string;
  fxToHome: number;       // multiplier to USD
  vatRate?: number;       // %
  vatReclaimPct?: number; // %
  description: string;
  paymentMethod: string;
  business?: number;      // 0-100, default 100
};

const HOME_CCY = "USD";

// Meghan — Global management consultant (London-based). 3-week itinerary across
// London → Dubai → Singapore → Tokyo → New York. Premium cabins, 5★ hotels,
// client dinners, conferences. Strong VAT-reclaim profile in EU/GCC.
const MEGHAN_SEEDS: Seed[] = [
  // ─── Week 1 — London base + Dubai sprint ───
  { daysAgo: 21, vendor: "British Airways",          country: "GB", category: "flight",       amount: 4_280, currency: "GBP", fxToHome: 1.27, vatRate: 0,  vatReclaimPct: 0,  description: "LHR → DXB Business Class — Acme client kickoff", paymentMethod: "Amex Platinum" },
  { daysAgo: 20, vendor: "Burj Al Arab Jumeirah",    country: "AE", category: "hotel",        amount: 9_400, currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "3 nights — Acme strategic offsite",              paymentMethod: "Amex Platinum" },
  { daysAgo: 20, vendor: "Nobu Dubai",               country: "AE", category: "meal",         amount: 1_850, currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "Client dinner — Acme C-suite (4 pax)",           paymentMethod: "Amex Platinum" },
  { daysAgo: 19, vendor: "Careem Business",          country: "AE", category: "transport",    amount: 420,   currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "DIFC ↔ hotel transfers (week)",                  paymentMethod: "Amex Platinum" },
  { daysAgo: 18, vendor: "Address Downtown — Bar",   country: "AE", category: "entertainment",amount: 920,   currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 50, description: "Post-workshop drinks with steering committee",   paymentMethod: "Amex Platinum" },

  // ─── Week 2 — Singapore + Tokyo ───
  { daysAgo: 17, vendor: "Singapore Airlines",       country: "SG", category: "flight",       amount: 3_950, currency: "SGD", fxToHome: 0.74, vatRate: 0,  vatReclaimPct: 0,  description: "DXB → SIN Business Class",                       paymentMethod: "Amex Platinum" },
  { daysAgo: 16, vendor: "Raffles Hotel Singapore",  country: "SG", category: "hotel",        amount: 4_200, currency: "SGD", fxToHome: 0.74, vatRate: 9,  vatReclaimPct: 0,  description: "4 nights — APAC partner conference",             paymentMethod: "Amex Platinum" },
  { daysAgo: 16, vendor: "Marina Bay Sands Conf.",   country: "SG", category: "conference",   amount: 2_400, currency: "SGD", fxToHome: 0.74, vatRate: 9,  vatReclaimPct: 0,  description: "Gartner CIO Summit — registration",              paymentMethod: "Corporate AmEx" },
  { daysAgo: 15, vendor: "Odette",                   country: "SG", category: "meal",         amount: 1_180, currency: "SGD", fxToHome: 0.74, vatRate: 9,  vatReclaimPct: 0,  description: "Client lunch — APAC MD",                         paymentMethod: "Amex Platinum" },
  { daysAgo: 14, vendor: "Grab Business",            country: "SG", category: "transport",    amount: 320,   currency: "SGD", fxToHome: 0.74, vatRate: 9,  vatReclaimPct: 0,  description: "Conference week transfers",                      paymentMethod: "Amex Platinum" },

  { daysAgo: 13, vendor: "Japan Airlines",           country: "JP", category: "flight",       amount: 318_000, currency: "JPY", fxToHome: 0.0066, vatRate: 0, vatReclaimPct: 0, description: "SIN → HND Business Class", paymentMethod: "Amex Platinum" },
  { daysAgo: 12, vendor: "Aman Tokyo",               country: "JP", category: "hotel",        amount: 720_000, currency: "JPY", fxToHome: 0.0066, vatRate: 10, vatReclaimPct: 0, description: "3 nights — Tokyo client engagement", paymentMethod: "Amex Platinum" },
  { daysAgo: 12, vendor: "Sukiyabashi Jiro",         country: "JP", category: "meal",         amount: 96_000,  currency: "JPY", fxToHome: 0.0066, vatRate: 10, vatReclaimPct: 0, description: "Executive client dinner (3 pax)", paymentMethod: "Amex Platinum" },
  { daysAgo: 11, vendor: "JR East — Shinkansen",     country: "JP", category: "transport",    amount: 28_400,  currency: "JPY", fxToHome: 0.0066, vatRate: 10, vatReclaimPct: 0, description: "Tokyo ↔ Osaka — Sony briefing", paymentMethod: "Amex Platinum" },

  // ─── Week 3 — New York close-out ───
  { daysAgo: 9,  vendor: "American Airlines",        country: "US", category: "flight",       amount: 5_840, currency: "USD", fxToHome: 1.00, vatRate: 0,  vatReclaimPct: 0,  description: "HND → JFK Business Class",                       paymentMethod: "Amex Platinum" },
  { daysAgo: 8,  vendor: "The Mark Hotel",           country: "US", category: "hotel",        amount: 4_650, currency: "USD", fxToHome: 1.00, vatRate: 14.75, vatReclaimPct: 0, description: "5 nights — Manhattan client week", paymentMethod: "Amex Platinum" },
  { daysAgo: 7,  vendor: "Le Bernardin",             country: "US", category: "meal",         amount: 1_280, currency: "USD", fxToHome: 1.00, vatRate: 8.875, vatReclaimPct: 0, description: "Client dinner — Goldman partners (4 pax)", paymentMethod: "Amex Platinum" },
  { daysAgo: 6,  vendor: "Uber Business",            country: "US", category: "transport",    amount: 380,   currency: "USD", fxToHome: 1.00, vatRate: 0,  vatReclaimPct: 0,  description: "NYC client meetings — week",                     paymentMethod: "Amex Platinum" },
  { daysAgo: 5,  vendor: "Equinox Hotels Spa",       country: "US", category: "other",        amount: 420,   currency: "USD", fxToHome: 1.00, vatRate: 0,  vatReclaimPct: 0,  description: "Wellness — recovery between client meetings",    paymentMethod: "Amex Platinum", business: 0 },

  // ─── London expenses (home base, this month) ───
  { daysAgo: 4,  vendor: "Soho House",               country: "GB", category: "meal",         amount: 285,   currency: "GBP", fxToHome: 1.27, vatRate: 20, vatReclaimPct: 0,  description: "Working lunch — internal team",                   paymentMethod: "Corporate AmEx" },
  { daysAgo: 3,  vendor: "BP Mayfair",               country: "GB", category: "fuel",         amount: 92,    currency: "GBP", fxToHome: 1.27, vatRate: 20, vatReclaimPct: 100,description: "Fuel — client visits SE England",                paymentMethod: "Corporate AmEx" },
  { daysAgo: 2,  vendor: "Vodafone UK",              country: "GB", category: "phone",        amount: 78,    currency: "GBP", fxToHome: 1.27, vatRate: 20, vatReclaimPct: 100,description: "Mobile + international roaming",                  paymentMethod: "Direct debit" },
  { daysAgo: 1,  vendor: "WeWork Moorgate",          country: "GB", category: "supplies",     amount: 540,   currency: "GBP", fxToHome: 1.27, vatRate: 20, vatReclaimPct: 100,description: "Co-working hot-desk monthly",                     paymentMethod: "Corporate AmEx" },
];

// John — US tech executive on a 6-month relocation rotation: NYC → Berlin →
// Lisbon → Dubai. Mix of flights, longer-stay apartments, conferences, family
// dinners. Heavy EU VAT-reclaim profile.
const JOHN_SEEDS: Seed[] = [
  { daysAgo: 23, vendor: "United Airlines",          country: "US", category: "flight",       amount: 3_240, currency: "USD", fxToHome: 1.00, vatRate: 0,  vatReclaimPct: 0,  description: "EWR → BER Business — relocation leg",            paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 22, vendor: "Hotel Adlon Kempinski",    country: "DE", category: "hotel",        amount: 1_950, currency: "EUR", fxToHome: 1.08, vatRate: 7,  vatReclaimPct: 100,description: "5 nights — Berlin office onboarding",            paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 21, vendor: "Borchardt",                country: "DE", category: "meal",         amount: 380,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Welcome dinner — Berlin leadership team",        paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 20, vendor: "Sixt Premium",             country: "DE", category: "transport",    amount: 540,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Rental car — week 1 client visits",              paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 19, vendor: "Aral Tankstelle",          country: "DE", category: "fuel",         amount: 180,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Fuel — Berlin ↔ Leipzig client trip",            paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 18, vendor: "BMW Welt Conference",      country: "DE", category: "conference",   amount: 850,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Mobility Tech Summit registration",              paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 17, vendor: "DB Bahn 1st Class",        country: "DE", category: "transport",    amount: 240,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "BER → MUC return — BMW briefing",                paymentMethod: "Chase Ink Preferred" },

  // Lisbon leg
  { daysAgo: 15, vendor: "TAP Air Portugal",         country: "PT", category: "flight",       amount: 980,   currency: "EUR", fxToHome: 1.08, vatRate: 6,  vatReclaimPct: 0,  description: "BER → LIS — quarterly EMEA review",              paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 14, vendor: "Bairro Alto Hotel",        country: "PT", category: "hotel",        amount: 1_180, currency: "EUR", fxToHome: 1.08, vatRate: 6,  vatReclaimPct: 100,description: "4 nights — Lisbon office",                       paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 13, vendor: "Belcanto",                 country: "PT", category: "meal",         amount: 320,   currency: "EUR", fxToHome: 1.08, vatRate: 13, vatReclaimPct: 100,description: "Client dinner — EMEA partners (3 pax)",          paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 12, vendor: "Bolt Business",            country: "PT", category: "transport",    amount: 165,   currency: "EUR", fxToHome: 1.08, vatRate: 23, vatReclaimPct: 100,description: "Lisbon week — meetings + airport",               paymentMethod: "Chase Ink Preferred" },

  // Dubai leg
  { daysAgo: 10, vendor: "Emirates",                 country: "AE", category: "flight",       amount: 2_650, currency: "EUR", fxToHome: 1.08, vatRate: 0,  vatReclaimPct: 0,  description: "LIS → DXB Business — MEA expansion",             paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 9,  vendor: "Four Seasons Resort DIFC", country: "AE", category: "hotel",        amount: 5_800, currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "3 nights — DIFC partner meetings",               paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 8,  vendor: "Zuma Dubai",               country: "AE", category: "meal",         amount: 1_420, currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "Investor dinner (5 pax)",                        paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 7,  vendor: "Careem Business",          country: "AE", category: "transport",    amount: 280,   currency: "AED", fxToHome: 0.27, vatRate: 5,  vatReclaimPct: 100,description: "DIFC week transfers",                            paymentMethod: "Chase Ink Preferred" },

  // Returns + ongoing
  { daysAgo: 5,  vendor: "Lufthansa",                country: "DE", category: "flight",       amount: 1_840, currency: "EUR", fxToHome: 1.08, vatRate: 0,  vatReclaimPct: 0,  description: "DXB → BER — return to base",                     paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 4,  vendor: "WeWork Sony Center",       country: "DE", category: "supplies",     amount: 620,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Berlin co-working monthly",                       paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 3,  vendor: "Telekom Deutschland",      country: "DE", category: "phone",        amount: 95,    currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "Mobile + EU data plan",                          paymentMethod: "Direct debit" },
  { daysAgo: 2,  vendor: "Galeries Lafayette Berlin",country: "DE", category: "gift",         amount: 240,   currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 50, description: "Client thank-you gifts",                          paymentMethod: "Chase Ink Preferred" },
  { daysAgo: 1,  vendor: "Apple Store Kurfürstendamm",country:"DE", category: "supplies",     amount: 1_290, currency: "EUR", fxToHome: 1.08, vatRate: 19, vatReclaimPct: 100,description: "iPad Pro M4 — field-team replacement",            paymentMethod: "Corporate Card" },
];

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function buildRow(seed: Seed, idx: number, personaId: string): ExpenseRow {
  const date = isoDateDaysAgo(seed.daysAgo);
  const vatAmount = seed.vatRate ? +(seed.amount * seed.vatRate / (100 + seed.vatRate)).toFixed(2) : 0;
  const amountHome = +(seed.amount * seed.fxToHome).toFixed(2);
  const business = seed.business ?? 100;
  const id = `demo-${personaId}-${idx}`;
  const now = new Date().toISOString();
  return {
    id,
    user_id: null,
    device_id: `demo-${personaId}`,
    trip_id: null,
    expense_date: date,
    amount: seed.amount,
    currency: seed.currency,
    amount_home: amountHome,
    home_currency: HOME_CCY,
    fx_rate: seed.fxToHome,
    category: seed.category,
    description: seed.description,
    vendor: seed.vendor,
    vendor_country_code: seed.country,
    payment_method: seed.paymentMethod,
    vat_amount: vatAmount,
    vat_rate: seed.vatRate ?? null,
    supplier_vat_id: null,
    vat_reclaimable: (seed.vatReclaimPct ?? 0) > 0,
    vat_reclaim_pct: seed.vatReclaimPct ?? 0,
    is_business: business > 0,
    business_percentage: business,
    source: "manual",
    source_ref: null,
    receipt_id: null,
    status: "confirmed",
    reclaim_status: (seed.vatReclaimPct ?? 0) > 0 ? "reclaim_pending" : "n/a",
    tags: ["demo", personaId],
    metadata: { demo: true, persona: personaId },
    created_at: now,
    updated_at: now,
  };
}

export function getDemoExpensesForPersona(personaId: string | null): ExpenseRow[] {
  if (!personaId) return [];
  const seeds = personaId === "meghan" ? MEGHAN_SEEDS : personaId === "john" ? JOHN_SEEDS : [];
  return seeds.map((s, i) => buildRow(s, i, personaId));
}
