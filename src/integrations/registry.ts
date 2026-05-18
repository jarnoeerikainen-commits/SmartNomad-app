/**
 * SuperNomad Integration Registry — Single Source of Truth
 * ---------------------------------------------------------
 * Machine-readable manifest of every external API the app integrates with
 * (or is reverse-engineered to integrate with). Used by:
 *   • Frontend services & feature gates (check status before calling)
 *   • Edge function adapters (lookup auth + endpoints)
 *   • Admin "Integrations" page (render status, request connection)
 *   • Concierge AI (announce what's live, what's demo)
 *
 * Keep in sync with `docs/INTEGRATIONS.md` and
 * `knowledge://skill/integration-prompts/` (per-provider prompts).
 *
 * MODE:
 *   • "live"    — secret present, adapter wired, production calls active
 *   • "ready"   — adapter coded, awaiting secret/contract activation
 *   • "demo"    — returns curated mock data (Source-of-Truth flagged)
 *   • "planned" — designed but not yet scaffolded
 */

export type IntegrationMode = 'live' | 'ready' | 'demo' | 'planned';

export type IntegrationDomain =
  | 'ai'              // LLM / embeddings / TTS / STT / vision
  | 'travel'          // flights, hotels, transit, charter
  | 'dining'          // Michelin / 50Best / reservations
  | 'identity'        // KYC, Trust Pass, walt.id
  | 'payments'        // Stripe, x402, USDC, Issuing
  | 'communication'   // email, SMS, calls, push
  | 'safety'          // threat intel, embassies, weather alerts
  | 'compliance'      // visa, tax, school holidays, ETIAS
  | 'health'          // vaccines, telehealth, jet-lag
  | 'productivity'    // calendar, docs, OCR, storage
  | 'community'       // social, Pulse, Vibe
  | 'commerce'        // marketplace, loyalty, affiliates
  | 'location'        // IP geo, maps, places, transit
  | 'data';           // B2B packages, source monitor

export interface IntegrationProvider {
  id: string;
  name: string;
  homepage: string;
  authType: 'api_key' | 'oauth2' | 'jwt' | 'basic' | 'none' | 'managed_connector';
  /** Secret names the edge function reads (Deno.env.get) */
  secretNames: string[];
  /** Base URL(s) for live calls */
  baseUrl?: string;
  /** Lovable Connector slug if routed via connector-gateway.lovable.dev */
  connectorSlug?: string;
  docsUrl?: string;
  rateLimit?: string;
  pricingNotes?: string;
}

export interface IntegrationEntry {
  /** Stable key, kebab-case */
  key: string;
  /** Human-readable name */
  name: string;
  domain: IntegrationDomain;
  mode: IntegrationMode;
  /** SuperNomad features that depend on this integration */
  features: string[];
  /** Edge function(s) that should host the live call */
  edgeFunctions: string[];
  /** Service files on the frontend that consume it */
  services: string[];
  /** Candidate providers, in order of preference */
  providers: IntegrationProvider[];
  /** Short description for admin UI & docs */
  description: string;
  /** Path under knowledge://skill/integration-prompts/ to ready-made prompt */
  promptFile?: string;
  /** Anything a coder must know before flipping demo→live */
  activationNotes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const INTEGRATIONS: IntegrationEntry[] = [
  // ── AI ────────────────────────────────────────────────────────────────────
  {
    key: 'ai-gateway',
    name: 'Lovable AI Gateway',
    domain: 'ai',
    mode: 'live',
    features: ['concierge', 'travel-planner', 'legal-chat', 'medical-chat', 'translate-ui', 'fine-dining'],
    edgeFunctions: [
      'travel-assistant', 'concierge-evaluator', 'fine-dining', 'legal-chat',
      'medical-chat', 'cyber-assistant', 'support-ai', 'marketplace-ai',
      'translate-ui', 'admin-ai-brain', 'admin-ai-ceo', 'community-orchestrator',
      'snomad-orchestrator', 'memory-distill', 'generate-embedding',
    ],
    services: ['AIMemoryService.ts'],
    providers: [{
      id: 'lovable-ai-gateway',
      name: 'Lovable AI Gateway (Gemini 3 Flash / Pro)',
      homepage: 'https://ai.gateway.lovable.dev',
      authType: 'api_key',
      secretNames: ['LOVABLE_API_KEY'],
      baseUrl: 'https://ai.gateway.lovable.dev/v1',
      docsUrl: 'https://docs.lovable.dev/integrations/ai',
    }],
    description: 'Primary LLM + embedding endpoint. All concierge & specialist AI route through here.',
    promptFile: 'ai-gateway.md',
  },
  {
    key: 'elevenlabs-tts',
    name: 'ElevenLabs TTS',
    domain: 'ai',
    mode: 'live',
    features: ['concierge-voice', 'voice-replies'],
    edgeFunctions: ['elevenlabs-tts'],
    services: ['hooks/voice/elevenLabsStream.ts'],
    providers: [{
      id: 'elevenlabs',
      name: 'ElevenLabs',
      homepage: 'https://elevenlabs.io',
      authType: 'api_key',
      secretNames: ['ELEVENLABS_API_KEY'],
      baseUrl: 'https://api.elevenlabs.io/v1',
      docsUrl: 'https://elevenlabs.io/docs/api-reference',
    }],
    description: 'Streaming TTS for the Concierge male voice (configured pitch/rate).',
    promptFile: 'elevenlabs-tts.md',
  },
  {
    key: 'liveavatar',
    name: 'HeyGen LiveAvatar',
    domain: 'ai',
    mode: 'ready',
    features: ['concierge-avatar', 'avatar-system'],
    edgeFunctions: ['liveavatar-session'],
    services: ['lib/heygenStub.js'],
    providers: [{
      id: 'heygen',
      name: 'HeyGen Interactive Avatar',
      homepage: 'https://heygen.com',
      authType: 'api_key',
      secretNames: ['HEYGEN_API_KEY'],
      baseUrl: 'https://api.heygen.com/v1',
      docsUrl: 'https://docs.heygen.com',
    }],
    description: 'Real-time talking avatar synced with concierge TTS.',
    promptFile: 'heygen-liveavatar.md',
    activationNotes: 'Set HEYGEN_API_KEY; mouth-tracking already wired in AvatarSystem.',
  },

  // ── DINING ────────────────────────────────────────────────────────────────
  {
    key: 'michelin-50best',
    name: 'Michelin / World\'s 50 Best (research)',
    domain: 'dining',
    mode: 'live',
    features: ['fine-dining', 'concierge-dining'],
    edgeFunctions: ['fine-dining'],
    services: ['FineDiningService.ts'],
    providers: [{
      id: 'michelin-web',
      name: 'Michelin Guide (web)',
      homepage: 'https://guide.michelin.com',
      authType: 'none',
      secretNames: [],
      docsUrl: 'https://guide.michelin.com',
    }, {
      id: '50best-web',
      name: 'The World\'s 50 Best Restaurants',
      homepage: 'https://theworlds50best.com',
      authType: 'none',
      secretNames: [],
    }],
    description: 'Verified restaurant lists via AI Gateway research with source-of-truth hierarchy.',
    promptFile: 'fine-dining.md',
  },
  {
    key: 'reservation-booking',
    name: 'Restaurant Reservation Engines',
    domain: 'dining',
    mode: 'ready',
    features: ['fine-dining-booking', 'concierge-booking'],
    edgeFunctions: ['concierge-actions'],
    services: ['FineDiningService.ts'],
    providers: [
      { id: 'tock', name: 'Tock', homepage: 'https://www.exploretock.com', authType: 'api_key', secretNames: ['TOCK_API_KEY'], docsUrl: 'https://www.exploretock.com/partners' },
      { id: 'resy', name: 'Resy', homepage: 'https://resy.com', authType: 'api_key', secretNames: ['RESY_API_KEY'] },
      { id: 'opentable', name: 'OpenTable', homepage: 'https://opentable.com', authType: 'api_key', secretNames: ['OPENTABLE_API_KEY', 'OPENTABLE_RID'], docsUrl: 'https://platform.opentable.com' },
      { id: 'sevenrooms', name: 'SevenRooms', homepage: 'https://sevenrooms.com', authType: 'api_key', secretNames: ['SEVENROOMS_API_KEY'] },
    ],
    description: 'Direct booking. Schema in FineDiningRestaurant.booking[] reverse-engineered to match all four providers.',
    promptFile: 'reservation-booking.md',
    activationNotes: 'Switch FineDiningService.bookReservation() demo→live by reading providers per restaurant.booking entry.',
  },

  // ── TRAVEL ────────────────────────────────────────────────────────────────
  {
    key: 'flights',
    name: 'Flight Search & Booking',
    domain: 'travel',
    mode: 'demo',
    features: ['travel-planner', 'concierge-flight'],
    edgeFunctions: ['travel-planner'],
    services: [],
    providers: [
      { id: 'duffel', name: 'Duffel', homepage: 'https://duffel.com', authType: 'api_key', secretNames: ['DUFFEL_API_KEY'], baseUrl: 'https://api.duffel.com/air', docsUrl: 'https://duffel.com/docs/api' },
      { id: 'amadeus', name: 'Amadeus Self-Service', homepage: 'https://developers.amadeus.com', authType: 'oauth2', secretNames: ['AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET'] },
      { id: 'kiwi-tequila', name: 'Kiwi Tequila', homepage: 'https://tequila.kiwi.com', authType: 'api_key', secretNames: ['KIWI_API_KEY'] },
    ],
    description: 'Live flight pricing + booking. Premium-search default per Booking Logic memory.',
    promptFile: 'flights.md',
  },
  {
    key: 'hotels',
    name: 'Hotel Inventory',
    domain: 'travel',
    mode: 'demo',
    features: ['travel-planner', 'concierge-stay'],
    edgeFunctions: ['travel-planner'],
    services: [],
    providers: [
      { id: 'amadeus-hotel', name: 'Amadeus Hotel API', homepage: 'https://developers.amadeus.com', authType: 'oauth2', secretNames: ['AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET'] },
      { id: 'booking-affiliate', name: 'Booking.com Affiliate', homepage: 'https://partner.booking.com', authType: 'api_key', secretNames: ['BOOKING_AFFILIATE_ID'] },
      { id: 'hotelbeds', name: 'Hotelbeds', homepage: 'https://developer.hotelbeds.com', authType: 'api_key', secretNames: ['HOTELBEDS_API_KEY', 'HOTELBEDS_SECRET'] },
    ],
    description: 'Premium hotel search; Concierge prefers 5★ + suites by default.',
    promptFile: 'hotels.md',
  },
  {
    key: 'rides',
    name: 'Ride-Hailing & Ground Transport',
    domain: 'travel',
    mode: 'ready',
    features: ['transportation-hub', 'concierge-transport'],
    edgeFunctions: ['karhoo-rides'],
    services: ['RideHailingService.ts'],
    providers: [
      { id: 'karhoo', name: 'Karhoo (B2B aggregator)', homepage: 'https://karhoo.com', authType: 'api_key', secretNames: ['KARHOO_API_KEY', 'KARHOO_SECRET'], baseUrl: 'https://rest.karhoo.com/v2' },
      { id: 'uber', name: 'Uber for Business', homepage: 'https://business.uber.com', authType: 'oauth2', secretNames: ['UBER_CLIENT_ID', 'UBER_CLIENT_SECRET'] },
      { id: 'lyft', name: 'Lyft Business', homepage: 'https://lyft.com/business', authType: 'oauth2', secretNames: ['LYFT_CLIENT_ID', 'LYFT_CLIENT_SECRET'] },
    ],
    description: 'Premium black-car & airport transfers. Karhoo covers 100+ cities in one contract.',
    promptFile: 'rides.md',
  },
  {
    key: 'air-charter',
    name: 'Private Jet & Empty Legs',
    domain: 'travel',
    mode: 'demo',
    features: ['air-charter-service'],
    edgeFunctions: [],
    services: [],
    providers: [
      { id: 'paramount', name: 'Paramount Business Jets', homepage: 'https://paramountbusinessjets.com', authType: 'api_key', secretNames: ['PARAMOUNT_API_KEY'] },
      { id: 'jettly', name: 'Jettly', homepage: 'https://jettly.com', authType: 'api_key', secretNames: ['JETTLY_API_KEY'] },
      { id: 'avinode', name: 'Avinode Marketplace', homepage: 'https://avinode.com', authType: 'oauth2', secretNames: ['AVINODE_CLIENT_ID', 'AVINODE_CLIENT_SECRET'] },
    ],
    description: 'Empty-leg discounts + on-demand charter quoting.',
    promptFile: 'air-charter.md',
  },

  // ── IDENTITY & TRUST ─────────────────────────────────────────────────────
  {
    key: 'walt-id',
    name: 'walt.id Identity & Credentials',
    domain: 'identity',
    mode: 'live',
    features: ['trust-pass', 'snomad-id', 'identity-vault'],
    edgeFunctions: ['walt-id-verifier', 'trust-pass-verify'],
    services: ['TrustPassService.ts'],
    providers: [{
      id: 'walt-id',
      name: 'walt.id',
      homepage: 'https://walt.id',
      authType: 'jwt',
      secretNames: ['WALT_ID_API_KEY', 'WALT_ID_TENANT'],
      baseUrl: 'https://issuer.walt.id',
      docsUrl: 'https://docs.walt.id',
    }],
    description: 'JWT-VC issuance for SuperNomad Trust Pass tiers.',
    promptFile: 'walt-id.md',
  },
  {
    key: 'kyc-liveness',
    name: 'KYC & Liveness',
    domain: 'identity',
    mode: 'planned',
    features: ['fast-id-verification', 'sovereign-access'],
    edgeFunctions: [],
    services: [],
    providers: [
      { id: 'persona', name: 'Persona', homepage: 'https://withpersona.com', authType: 'api_key', secretNames: ['PERSONA_API_KEY'] },
      { id: 'onfido', name: 'Onfido', homepage: 'https://onfido.com', authType: 'api_key', secretNames: ['ONFIDO_API_KEY'] },
      { id: 'sumsub', name: 'Sumsub', homepage: 'https://sumsub.com', authType: 'api_key', secretNames: ['SUMSUB_APP_TOKEN', 'SUMSUB_SECRET'] },
    ],
    description: 'Document + selfie liveness for Sovereign Trust upgrades.',
    promptFile: 'kyc.md',
  },

  // ── PAYMENTS ──────────────────────────────────────────────────────────────
  {
    key: 'stripe-issuing',
    name: 'Stripe Issuing & Connect',
    domain: 'payments',
    mode: 'ready',
    features: ['agentic-commerce', 'agentic-payments', 'virtual-cards'],
    edgeFunctions: ['agentic-payments-router'],
    services: ['AgenticPaymentService.ts'],
    providers: [{
      id: 'stripe',
      name: 'Stripe',
      homepage: 'https://stripe.com',
      authType: 'api_key',
      secretNames: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
      baseUrl: 'https://api.stripe.com/v1',
      docsUrl: 'https://stripe.com/docs/api',
    }],
    description: 'Issue virtual cards per agentic transaction; Connect for affiliate payouts.',
    promptFile: 'stripe.md',
  },
  {
    key: 'x402',
    name: 'x402 Agentic Payments',
    domain: 'payments',
    mode: 'planned',
    features: ['agentic-commerce'],
    edgeFunctions: ['agentic-payments-router'],
    services: ['AgenticPaymentService.ts'],
    providers: [{
      id: 'coinbase-x402',
      name: 'Coinbase x402',
      homepage: 'https://x402.org',
      authType: 'api_key',
      secretNames: ['X402_API_KEY', 'X402_FACILITATOR_URL'],
      docsUrl: 'https://x402.org/docs',
    }],
    description: 'HTTP 402 micropayments via USDC; AI-to-AI commerce rail.',
    promptFile: 'x402.md',
  },
  {
    key: 'usdc-base',
    name: 'USDC on Base (affiliate payouts)',
    domain: 'payments',
    mode: 'planned',
    features: ['affiliate-payouts'],
    edgeFunctions: ['affiliate-router'],
    services: ['AffiliateService.ts'],
    providers: [{
      id: 'coinbase-cdp',
      name: 'Coinbase Developer Platform',
      homepage: 'https://www.coinbase.com/developer-platform',
      authType: 'api_key',
      secretNames: ['CDP_API_KEY', 'CDP_API_SECRET'],
    }],
    description: 'Low-fee USDC payouts on Base L2 ($0.50 flat).',
    promptFile: 'usdc-base.md',
  },

  // ── COMMUNICATION ─────────────────────────────────────────────────────────
  {
    key: 'twilio-voice',
    name: 'Twilio Voice (concierge calls)',
    domain: 'communication',
    mode: 'ready',
    features: ['concierge-actions', 'phone-calls'],
    edgeFunctions: ['concierge-actions', 'supernomad-call'],
    services: [],
    providers: [{
      id: 'twilio',
      name: 'Twilio',
      homepage: 'https://twilio.com',
      authType: 'managed_connector',
      secretNames: ['TWILIO_API_KEY', 'TWILIO_PHONE_NUMBER'],
      connectorSlug: 'twilio',
      baseUrl: 'https://connector-gateway.lovable.dev/twilio',
    }],
    description: 'Real outbound calls for reservations & service requests. Wired via Lovable connector gateway.',
    promptFile: 'twilio.md',
    activationNotes: 'Toggle app_settings.real_calling_enabled = true; ensure TWILIO_PHONE_NUMBER is purchased.',
  },
  {
    key: 'resend-email',
    name: 'Resend (transactional email)',
    domain: 'communication',
    mode: 'ready',
    features: ['reports', 'visa-reminders', 'tax-summaries', 'org-invites'],
    edgeFunctions: ['org-management', 'send-calendar-reminder'],
    services: [],
    providers: [{
      id: 'resend',
      name: 'Resend',
      homepage: 'https://resend.com',
      authType: 'api_key',
      secretNames: ['RESEND_API_KEY'],
      baseUrl: 'https://api.resend.com',
      docsUrl: 'https://resend.com/docs',
    }],
    description: 'Weekly nomad reports, visa expiry, calendar reminders, org invites.',
    promptFile: 'resend.md',
  },
  {
    key: 'telegram-bot',
    name: 'Telegram Bot (instant alerts)',
    domain: 'communication',
    mode: 'planned',
    features: ['threat-alerts', 'sos-services'],
    edgeFunctions: [],
    services: [],
    providers: [{
      id: 'telegram-bot-api',
      name: 'Telegram Bot API',
      homepage: 'https://core.telegram.org/bots',
      authType: 'api_key',
      secretNames: ['TELEGRAM_BOT_TOKEN'],
    }],
    description: 'Push real-time safety alerts to subscribed users.',
    promptFile: 'telegram.md',
  },

  // ── SAFETY & INTEL ────────────────────────────────────────────────────────
  {
    key: 'threat-intel',
    name: 'Threat & Travel Advisory Intel',
    domain: 'safety',
    mode: 'demo',
    features: ['threat-intelligence', 'guardian', 'safety-infrastructure'],
    edgeFunctions: ['source-monitor'],
    services: ['ThreatIntelligenceService.ts'],
    providers: [
      { id: 'gdacs', name: 'GDACS Disaster Alerts', homepage: 'https://www.gdacs.org', authType: 'none', secretNames: [] },
      { id: 'state-gov', name: 'US State Dept Advisories', homepage: 'https://travel.state.gov', authType: 'none', secretNames: [] },
      { id: 'gov-uk', name: 'UK Foreign Travel Advice', homepage: 'https://www.gov.uk/foreign-travel-advice', authType: 'none', secretNames: [] },
      { id: 'crisis24', name: 'Crisis24 (premium)', homepage: 'https://crisis24.garda.com', authType: 'api_key', secretNames: ['CRISIS24_API_KEY'] },
    ],
    description: 'Aggregated travel advisories + disaster alerts powering Guardian heartbeat.',
    promptFile: 'threat-intel.md',
  },
  {
    key: 'air-quality',
    name: 'Air Quality (WAQI)',
    domain: 'safety',
    mode: 'live',
    features: ['air-quality-indicator'],
    edgeFunctions: [],
    services: [],
    providers: [{
      id: 'waqi',
      name: 'World Air Quality Index',
      homepage: 'https://aqicn.org/api',
      authType: 'api_key',
      secretNames: ['WAQI_TOKEN'],
      baseUrl: 'https://api.waqi.info',
    }],
    description: 'Live AQI with 10-min cache (memory).',
    promptFile: 'waqi.md',
  },

  // ── COMPLIANCE ────────────────────────────────────────────────────────────
  {
    key: 'visa-rules',
    name: 'Visa & Border Rules',
    domain: 'compliance',
    mode: 'demo',
    features: ['visa-immigration-hub', 'visa-auto-matcher', '183-day-detector', 'etias-compliance'],
    edgeFunctions: ['source-monitor'],
    services: ['VisaAutoMatcherService.ts'],
    providers: [
      { id: 'sherpa', name: 'Sherpa° (Travel requirements API)', homepage: 'https://apply.joinsherpa.com', authType: 'api_key', secretNames: ['SHERPA_API_KEY'] },
      { id: 'ivisa', name: 'iVisa partners', homepage: 'https://ivisa.com', authType: 'api_key', secretNames: ['IVISA_API_KEY'] },
      { id: 'gov-source', name: 'Official gov portals (scraped via source-monitor)', homepage: '', authType: 'none', secretNames: [] },
    ],
    description: 'Schengen calc, ETIAS, visa requirements per nationality.',
    promptFile: 'visa-rules.md',
  },
  {
    key: 'school-holidays',
    name: 'Global School Holidays',
    domain: 'compliance',
    mode: 'live',
    features: ['school-holiday-intelligence'],
    edgeFunctions: ['school-holidays-refresh'],
    services: [],
    providers: [{
      id: 'ai-gateway-aggregator',
      name: 'AI-aggregated official ministry sources',
      homepage: '',
      authType: 'none',
      secretNames: ['LOVABLE_API_KEY'],
    }],
    description: 'Weekly refresh of ~190 countries × 4 seasons.',
    promptFile: 'school-holidays.md',
  },

  // ── HEALTH ────────────────────────────────────────────────────────────────
  {
    key: 'who-vaccines',
    name: 'WHO Vaccine Requirements',
    domain: 'health',
    mode: 'demo',
    features: ['vaccinations-medicines-hub'],
    edgeFunctions: [],
    services: [],
    providers: [
      { id: 'who-ith', name: 'WHO International Travel & Health', homepage: 'https://www.who.int/teams/ihm/centres-of-excellence/international-travel-and-health', authType: 'none', secretNames: [] },
      { id: 'cdc-travel', name: 'CDC Travelers Health', homepage: 'https://wwwnc.cdc.gov/travel', authType: 'none', secretNames: [] },
    ],
    description: 'Per-country vaccine + prophylaxis recommendations.',
    promptFile: 'who-vaccines.md',
  },

  // ── PRODUCTIVITY ──────────────────────────────────────────────────────────
  {
    key: 'email-oauth',
    name: 'Travel Inbox OAuth (Google + Microsoft)',
    domain: 'productivity',
    mode: 'live',
    features: ['travel-inbox', 'sovereign-access'],
    edgeFunctions: ['email-oauth-exchange'],
    services: [],
    providers: [
      { id: 'google-oauth', name: 'Google OAuth 2.0', homepage: 'https://developers.google.com/identity/protocols/oauth2', authType: 'oauth2', secretNames: ['GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET'] },
      { id: 'ms-graph', name: 'Microsoft Graph', homepage: 'https://learn.microsoft.com/graph', authType: 'oauth2', secretNames: ['MS_OAUTH_CLIENT_ID', 'MS_OAUTH_CLIENT_SECRET'] },
    ],
    description: 'Parse booking confirmations from user inboxes (consent-gated).',
    promptFile: 'email-oauth.md',
  },
  {
    key: 'receipt-ocr',
    name: 'Receipt OCR',
    domain: 'productivity',
    mode: 'live',
    features: ['expense-hub', 'tax-clear'],
    edgeFunctions: ['receipt-ocr'],
    services: ['ExpenseService.ts'],
    providers: [{
      id: 'ai-gateway-vision',
      name: 'AI Gateway Vision (Gemini)',
      homepage: 'https://ai.gateway.lovable.dev',
      authType: 'api_key',
      secretNames: ['LOVABLE_API_KEY'],
    }],
    description: 'Vision-LLM OCR for receipt → expense extraction.',
    promptFile: 'receipt-ocr.md',
  },
  {
    key: 'cloud-storage',
    name: 'Cloud Document Backup',
    domain: 'productivity',
    mode: 'planned',
    features: ['family-vault', 'identity-vault'],
    edgeFunctions: [],
    services: ['FamilyVaultService.ts', 'SnomadVaultService.ts'],
    providers: [
      { id: 'aws-s3', name: 'AWS S3', homepage: 'https://aws.amazon.com/s3', authType: 'api_key', secretNames: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET'] },
      { id: 'cloudflare-r2', name: 'Cloudflare R2', homepage: 'https://www.cloudflare.com/products/r2', authType: 'api_key', secretNames: ['R2_ACCESS_KEY', 'R2_SECRET', 'R2_BUCKET'] },
    ],
    description: 'Encrypted off-device backup of vault blobs (client-side AES-256-GCM first).',
    promptFile: 'cloud-storage.md',
  },

  // ── LOCATION ──────────────────────────────────────────────────────────────
  {
    key: 'ip-geo',
    name: 'IP Geolocation',
    domain: 'location',
    mode: 'live',
    features: ['location-services'],
    edgeFunctions: ['location-ip'],
    services: ['EnhancedLocationService.ts', 'locationProviders.ts'],
    providers: [
      { id: 'ipapi', name: 'ipapi.co', homepage: 'https://ipapi.co', authType: 'none', secretNames: [] },
      { id: 'ipinfo', name: 'ipinfo.io', homepage: 'https://ipinfo.io', authType: 'api_key', secretNames: ['IPINFO_TOKEN'] },
    ],
    description: 'Fallback IP geo when GPS unavailable; VPN detection.',
    promptFile: 'ip-geo.md',
  },
  {
    key: 'maps-places',
    name: 'Maps & Places',
    domain: 'location',
    mode: 'planned',
    features: ['business-centers', 'pet-services', 'fine-dining', 'embassy-directory'],
    edgeFunctions: ['venue-discovery'],
    services: ['BusinessCentersService.ts'],
    providers: [
      { id: 'mapbox', name: 'Mapbox', homepage: 'https://mapbox.com', authType: 'api_key', secretNames: ['MAPBOX_TOKEN'] },
      { id: 'google-places', name: 'Google Places (New)', homepage: 'https://developers.google.com/maps/documentation/places/web-service', authType: 'api_key', secretNames: ['GOOGLE_PLACES_API_KEY'] },
      { id: 'foursquare', name: 'Foursquare Places', homepage: 'https://location.foursquare.com', authType: 'api_key', secretNames: ['FSQ_API_KEY'] },
    ],
    description: 'Map tiles, place search, geocoding.',
    promptFile: 'maps-places.md',
  },
  {
    key: 'weather',
    name: 'Weather & Climate',
    domain: 'location',
    mode: 'live',
    features: ['weather-service'],
    edgeFunctions: [],
    services: [],
    providers: [{
      id: 'open-meteo',
      name: 'Open-Meteo (free, no key)',
      homepage: 'https://open-meteo.com',
      authType: 'none',
      secretNames: [],
      baseUrl: 'https://api.open-meteo.com/v1',
    }],
    description: '4-tab weather + sport-specific intelligence.',
    promptFile: 'weather.md',
  },

  // ── COMMERCE ──────────────────────────────────────────────────────────────
  {
    key: 'esim',
    name: 'eSIM provisioning',
    domain: 'commerce',
    mode: 'planned',
    features: ['travel-essentials'],
    edgeFunctions: [],
    services: [],
    providers: [
      { id: 'airalo', name: 'Airalo Partner', homepage: 'https://partners.airalo.com', authType: 'api_key', secretNames: ['AIRALO_CLIENT_ID', 'AIRALO_CLIENT_SECRET'] },
      { id: 'gigsky', name: 'GigSky', homepage: 'https://www.gigsky.com', authType: 'api_key', secretNames: ['GIGSKY_API_KEY'] },
    ],
    description: 'On-demand data plans per destination.',
    promptFile: 'esim.md',
  },
  {
    key: 'travel-insurance',
    name: 'Travel Insurance',
    domain: 'commerce',
    mode: 'planned',
    features: ['travel-essentials', 'sos-services'],
    edgeFunctions: [],
    services: [],
    providers: [
      { id: 'safetywing', name: 'SafetyWing affiliate', homepage: 'https://safetywing.com/partners', authType: 'api_key', secretNames: ['SAFETYWING_PARTNER_ID'] },
      { id: 'genki', name: 'Genki', homepage: 'https://genki.world', authType: 'api_key', secretNames: ['GENKI_PARTNER_ID'] },
    ],
    description: 'Nomad-friendly travel + health insurance affiliate.',
    promptFile: 'travel-insurance.md',
  },

  // ── DATA (B2B) ────────────────────────────────────────────────────────────
  {
    key: 'b2b-gateway',
    name: 'SuperNomad B2B Gateway',
    domain: 'data',
    mode: 'live',
    features: ['b2b-api-gateway', 'data-packaging'],
    edgeFunctions: ['supernomad-gateway', 'partner-data-query', 'data-package-query', 'gateway-admin'],
    services: [],
    providers: [{
      id: 'self',
      name: 'SuperNomad-hosted',
      homepage: 'https://docs.supernomad.app/api',
      authType: 'api_key',
      secretNames: [],
    }],
    description: 'Outbound API for partners; k-anonymity enforced, consent-gated.',
    promptFile: 'b2b-gateway.md',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getIntegration(key: string): IntegrationEntry | undefined {
  return INTEGRATIONS.find(i => i.key === key);
}

export function getIntegrationsByDomain(domain: IntegrationDomain): IntegrationEntry[] {
  return INTEGRATIONS.filter(i => i.domain === domain);
}

export function getIntegrationsByMode(mode: IntegrationMode): IntegrationEntry[] {
  return INTEGRATIONS.filter(i => i.mode === mode);
}

export function getIntegrationsForFeature(featureId: string): IntegrationEntry[] {
  return INTEGRATIONS.filter(i => i.features.includes(featureId));
}

/** All secret env-var names that must be provisioned for `live` + `ready` integrations */
export function getRequiredSecretNames(): string[] {
  const set = new Set<string>();
  for (const i of INTEGRATIONS) {
    if (i.mode === 'live' || i.mode === 'ready') {
      for (const p of i.providers) p.secretNames.forEach(s => set.add(s));
    }
  }
  return [...set].sort();
}

/** Brief, AI-friendly summary the Concierge can quote to users. */
export function getIntegrationSummaryForAI(): string {
  const live = getIntegrationsByMode('live').map(i => i.name);
  const ready = getIntegrationsByMode('ready').map(i => i.name);
  return [
    `Live integrations (${live.length}): ${live.join(', ') || 'none'}.`,
    `Ready to activate (${ready.length}): ${ready.join(', ') || 'none'}.`,
  ].join(' ');
}
