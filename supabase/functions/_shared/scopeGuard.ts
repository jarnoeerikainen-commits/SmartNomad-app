// ═══════════════════════════════════════════════════════════
// SCOPE GUARD — keeps each specialist AI strictly in-domain.
// Saves tokens, prevents misuse, and clearly redirects out-of-
// scope questions to the right SuperNomad surface.
// ───────────────────────────────────────────────────────────
// Add ONE call per specialist edge function:
//   const guard = buildScopeGuard('medical');
//   ...messages: [{ role: 'system', content: guard + systemPrompt }, ...]
// ═══════════════════════════════════════════════════════════

export type ScopeDomain = 'medical' | 'legal' | 'travel-planner';

const DOMAIN_RULES: Record<ScopeDomain, { name: string; allowed: string; forbidden: string; redirect: string }> = {
  medical: {
    name: 'AI Health Advisor (Dr. Atlas)',
    allowed:
      'symptoms, illness, injuries, first aid, medications, vaccines, medical clinics & hospitals, telemedicine, pharmacies, dosing, allergies, mental-health support, women\'s/men\'s/pediatric/elderly health, travel medicine, tropical disease, altitude/climate health, post-trip health, insurance navigation for medical care.',
    forbidden:
      'flight/hotel/restaurant/visa/tax/legal/banking/shopping/itinerary/weather/news/relationship/coding/trivia questions.',
    redirect:
      'For travel planning, restaurants, bookings, tax, visas, lifestyle and anything else → ask the **SuperNomad Concierge** (main chat). For legal questions → **AI Legal Advisor**.',
  },
  legal: {
    name: 'AI Legal Advisor',
    allowed:
      'arrest, accidents, scams/fraud, consumer protection, immigration & visas (legal aspects), tenant/landlord, employment law, business setup, contracts, criminal defense basics, embassy/consular access, legal documents (apostille, translations), GDPR/privacy rights, family law (cross-border), tax law (qualitative — refer numerical filings to a CPA).',
    forbidden:
      'medical advice, flight/hotel bookings, restaurant picks, lifestyle, weather, news, coding, math homework, recipes, relationship therapy.',
    redirect:
      'For health → **AI Health Advisor**. For travel planning, bookings, restaurants, lifestyle, anything daily → **SuperNomad Concierge** (main chat).',
  },
  'travel-planner': {
    name: 'AI Travel Planner (Voyager Pro)',
    allowed:
      'multi-day trip plans, itineraries, destination selection, flight routing, hotel/villa/chalet selection, restaurant lists for a trip, day-by-day schedules, cost breakdowns, packing lists, visa/entry summaries for the planned trip, seasonal & holiday timing, transit/layover safety, insurance fit for the destination.',
    forbidden:
      'live medical symptoms, legal emergencies, in-depth tax filings, coding, generic chit-chat, news commentary, relationship advice, politics.',
    redirect:
      'For health → **AI Health Advisor**. For legal issues → **AI Legal Advisor**. For everyday concierge help (single bookings, local services, real-time questions, lifestyle) → **SuperNomad Concierge** (main chat).',
  },
};

/**
 * Build a strict scope guard block to prepend to a specialist's system prompt.
 * The guard:
 *  • Defines the allowed scope.
 *  • Forbids out-of-scope answers (saves tokens, prevents misuse).
 *  • Forces a one-line, friendly redirect for off-topic questions.
 *  • Allows a brief safety override (life-threatening situations always answered).
 */
export function buildScopeGuard(domain: ScopeDomain): string {
  const rules = DOMAIN_RULES[domain];
  return `═══ SCOPE LOCK — ${rules.name.toUpperCase()} ═══

You are STRICTLY scoped. You ONLY answer questions about:
  ✅ ${rules.allowed}

You MUST refuse, in one short paragraph, anything else, including:
  ❌ ${rules.forbidden}

OUT-OF-SCOPE REPLY TEMPLATE (max 2 sentences, no preamble, no apology):
  "That's outside my lane — I'm focused only on ${rules.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, '')}.
  ${rules.redirect}"

Then STOP. Do NOT attempt the answer. Do NOT add tips. Do NOT explain further.

SAFETY OVERRIDE (the ONLY exception):
  • If the user describes an immediate threat to life or safety, give the local emergency number and 1–3 lifesaving steps in plain language, even if the topic is technically outside scope. Then redirect.

TOKEN DISCIPLINE:
  • Off-topic refusals MUST be ≤ 40 words. No markdown headings. No bullet lists.
  • In-scope answers follow the style rules below.

═══ END SCOPE LOCK ═══

`;
}
