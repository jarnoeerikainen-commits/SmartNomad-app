/**
 * Sovereign Access — Permission Registry
 *
 * Single source of truth for every device/data permission SuperNomad may
 * request. Each entry maps to:
 *  - the user-facing benefit (purpose string shown in pre-prompt)
 *  - the GDPR Art. 6 legal basis we rely on
 *  - the App Store / Play Store policy reference for store-review readiness
 *  - the underlying web/native API
 *
 * Rules of engagement (compliant with Apple Guideline 5.1.1, Google Play
 * "Permissions and APIs that Access Sensitive Information", and GDPR Art.
 * 5(1)(c) data minimisation):
 *
 *  1. NEVER request a permission at install / first launch.
 *  2. ALWAYS show our custom pre-prompt before the OS prompt fires, with
 *     a clear "Not now" option.
 *  3. EVERY grant or revoke is written to consent_ledger with the exact
 *     purpose string + version hash, so the user has an immutable audit
 *     trail of what they consented to.
 *  4. Sensitive scopes (calendar history, gmail, background location) are
 *     gated behind an EXPLICIT user action ("Import my trips") — never
 *     silent.
 */

import {
  MapPin, Calendar as CalendarIcon, Users as UsersIcon,
  Camera, Mic, Image as ImageIcon, Bell, Activity,
  Heart, Fingerprint, Bluetooth, RefreshCw, Mail,
  Inbox, Phone, FileText, Globe,
} from 'lucide-react';

export type PermissionId =
  | 'location-when-in-use'
  | 'location-always'
  | 'calendar-read'
  | 'calendar-write'
  | 'contacts'
  | 'camera'
  | 'microphone'
  | 'photos'
  | 'notifications'
  | 'motion'
  | 'health'
  | 'biometrics'
  | 'bluetooth'
  | 'background-refresh'
  | 'email-import-google'
  | 'email-import-microsoft'
  | 'email-forward'
  | 'phone-state'
  | 'storage-documents';

export type PermissionCategory =
  | 'location'
  | 'communications'
  | 'media'
  | 'system'
  | 'health'
  | 'identity';

export type GdprBasis =
  | 'consent'           // Art. 6(1)(a) — explicit opt-in
  | 'contract'          // Art. 6(1)(b) — needed to deliver the service
  | 'legal_obligation'  // Art. 6(1)(c) — required by law
  | 'vital_interest'    // Art. 6(1)(d) — life-or-death
  | 'legitimate_interest'; // Art. 6(1)(f) — balanced LIA

export interface PermissionSpec {
  id: PermissionId;
  category: PermissionCategory;
  icon: any;
  /** Short label for chips and list rows */
  label: string;
  /** One-sentence pitch for the soft onboarding tour */
  pitch: string;
  /** Full purpose string shown in pre-prompt + logged to consent_ledger */
  purpose: string;
  /** What we DO collect */
  collects: string[];
  /** What we EXPLICITLY do NOT do — builds trust */
  doesNotCollect: string[];
  /** Legal basis under GDPR Article 6 */
  gdprBasis: GdprBasis;
  /** App Store / Play Store policy citation for review readiness */
  storePolicy: string;
  /** Required platform — web means works in browser today */
  platforms: Array<'web' | 'ios' | 'android'>;
  /** True if requesting this needs an explicit Play Console / App Review declaration */
  requiresStoreDeclaration?: boolean;
  /** Recommended SuperNomad feature(s) that gate this permission */
  triggeredBy: string[];
  /** Sensitivity tier — drives confirmation strength */
  tier: 'low' | 'standard' | 'sensitive' | 'restricted';
  /** Version of the purpose string — bump when wording changes */
  purposeVersion: string;
}

export const PURPOSE_VERSION = '2026-04-21.v1';

export const PERMISSION_REGISTRY: PermissionSpec[] = [
  // ─────────── LOCATION ───────────
  {
    id: 'location-when-in-use',
    category: 'location',
    icon: MapPin,
    label: 'Location (while using the app)',
    pitch: 'Auto-count your days in each country for Schengen 90/180, EES & tax residency.',
    purpose:
      'SuperNomad uses your location only while the app is open to count days spent in each country, calculate Schengen 90-in-180 usage, surface local services, and prepare your tax residency reports. We never sell location data.',
    collects: ['Approximate country & city', 'Entry/exit timestamps'],
    doesNotCollect: ['Precise GPS coordinates outside the app', 'Location history sold to third parties'],
    gdprBasis: 'contract',
    storePolicy: 'Apple 5.1.1; Play "Location" — foreground only, no declaration form needed',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['gps-monitor', 'tax-residency', 'ees', 'etias'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'location-always',
    category: 'location',
    icon: MapPin,
    label: 'Background location',
    pitch: 'Detect border crossings even when the app is closed — never miss a Schengen exit.',
    purpose:
      'With background location, SuperNomad logs the exact day you cross a border so your 90/180 Schengen count and tax-residency days are always accurate. Off by default. You can disable it anytime in this dashboard or in your phone settings.',
    collects: ['Country/city changes detected in the background'],
    doesNotCollect: ['Continuous GPS pings', 'Movement inside a country'],
    gdprBasis: 'consent',
    storePolicy:
      'Apple 5.1.1 (must be primary feature); Play "Location in background" — Permissions Declaration Form + video demo required',
    platforms: ['ios', 'android'],
    requiresStoreDeclaration: true,
    triggeredBy: ['gps-monitor', 'ees'],
    tier: 'sensitive',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── COMMUNICATIONS ───────────
  {
    id: 'calendar-read',
    category: 'communications',
    icon: CalendarIcon,
    label: 'Calendar — read upcoming events',
    pitch: 'Auto-detect upcoming flights & hotel check-ins from your calendar so we can prep your trip.',
    purpose:
      'SuperNomad reads upcoming calendar events (next 90 days by default; you can extend) to detect travel plans — flight numbers, hotel check-ins, meetings abroad — and prepare visa, tax, and weather briefings. We do not read past events unless you explicitly ask us to import history.',
    collects: ['Event titles, dates, locations from the next N days you choose'],
    doesNotCollect: ['Full attendee email addresses', 'Personal events not related to travel'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSCalendarsFullAccessUsageDescription; Play READ_CALENDAR — runtime permission',
    platforms: ['ios', 'android'],
    triggeredBy: ['ai-planner', 'tax-residency', 'visa-matcher'],
    tier: 'sensitive',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'calendar-write',
    category: 'communications',
    icon: CalendarIcon,
    label: 'Calendar — add reminders',
    pitch: 'Add visa expiry, ETIAS renewals & Schengen warnings to your calendar.',
    purpose:
      'SuperNomad writes only the events you confirm — visa expiry alerts, ETIAS renewal dates, Schengen-day warnings, vaccination boosters. Each event is tagged "SuperNomad" so you can see and remove them anytime.',
    collects: ['Reminder events you approve'],
    doesNotCollect: ['Anything without your explicit tap'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSCalendarsWriteOnlyAccessUsageDescription (iOS 17+); Play WRITE_CALENDAR',
    platforms: ['ios', 'android'],
    triggeredBy: ['ees', 'etias', 'visas', 'vaccination-hub'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'contacts',
    category: 'communications',
    icon: UsersIcon,
    label: 'Contacts',
    pitch: 'Pick emergency contacts and share your Snomad ID with travel companions.',
    purpose:
      'SuperNomad accesses contacts only when you tap "Add emergency contact" or "Invite to trip". We never upload your full address book — we only store the contact you actually pick.',
    collects: ['Names & numbers of contacts you explicitly select'],
    doesNotCollect: ['Your full contact list', 'Continuous syncing'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSContactsUsageDescription; Play READ_CONTACTS — runtime permission',
    platforms: ['ios', 'android'],
    triggeredBy: ['emergency', 'sos-services', 'social-chat'],
    tier: 'sensitive',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'notifications',
    category: 'communications',
    icon: Bell,
    label: 'Push notifications',
    pitch: 'Schengen warnings, visa expiry, severe-weather, threat alerts in your country.',
    purpose:
      'SuperNomad sends notifications for time-sensitive travel & safety events: Schengen day-cap warnings, visa expiry, severe weather, threat-level changes in your current city. You can fine-tune categories in Settings.',
    collects: ['Push token (anonymous device identifier)'],
    doesNotCollect: ['Notification content sold to third parties'],
    gdprBasis: 'consent',
    storePolicy: 'Apple UNUserNotificationCenter; Play POST_NOTIFICATIONS (Android 13+)',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['alerts', 'gps-monitor', 'ees', 'threats'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── MEDIA ───────────
  {
    id: 'camera',
    category: 'media',
    icon: Camera,
    label: 'Camera',
    pitch: 'Scan passports, visas, and receipts straight into your encrypted vault.',
    purpose:
      'Camera is used only when you tap "Scan document" or "Capture receipt". Images are processed on-device for OCR where possible and stored encrypted in your Snomad ID vault.',
    collects: ['Photos you actively capture'],
    doesNotCollect: ['Camera roll', 'Background photos', 'Live video'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSCameraUsageDescription; Play CAMERA — runtime permission',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['vault', 'documents', 'expense-tracker'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'microphone',
    category: 'media',
    icon: Mic,
    label: 'Microphone',
    pitch: 'Talk to Sofia / Marcus, your voice concierge — hands-free while travelling.',
    purpose:
      'Microphone activates only when you tap the voice button. Audio is streamed to our speech-to-text service, immediately transcribed, and the raw audio is discarded — we never store voice recordings.',
    collects: ['Live transcript while you speak'],
    doesNotCollect: ['Raw audio recordings', 'Background listening', 'Wake-word always-on'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSMicrophoneUsageDescription; Play RECORD_AUDIO — runtime permission',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['ai', 'voice-control'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'photos',
    category: 'media',
    icon: ImageIcon,
    label: 'Photos (limited)',
    pitch: 'Pick specific receipts, passport scans, or trip photos to import — never your whole library.',
    purpose:
      'SuperNomad uses iOS / Android limited-photo-access mode: you select exactly which photos we can see. We never read your full camera roll.',
    collects: ['Photos you explicitly select'],
    doesNotCollect: ['Your full photo library', 'Photo metadata not in selection'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSPhotoLibraryAddUsageDescription + limited mode; Play READ_MEDIA_IMAGES (Android 13+)',
    platforms: ['ios', 'android'],
    triggeredBy: ['vault', 'expense-tracker', 'marketplace'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── HEALTH & ACTIVITY ───────────
  {
    id: 'motion',
    category: 'health',
    icon: Activity,
    label: 'Motion & fitness',
    pitch: 'Auto-detect when you board a flight or take a train so your travel log fills itself.',
    purpose:
      'Motion sensors help SuperNomad detect transitions (driving, flying, stationary) so we can auto-populate your travel timeline. Sensor data stays on-device.',
    collects: ['Activity-type changes (e.g. "started flying")'],
    doesNotCollect: ['Step counts', 'Workout data', 'Heart rate'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSMotionUsageDescription; Play ACTIVITY_RECOGNITION',
    platforms: ['ios', 'android'],
    triggeredBy: ['gps-monitor', 'tax-residency'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'health',
    category: 'health',
    icon: Heart,
    label: 'Health (vaccinations, jet-lag)',
    pitch: 'Sync vaccinations from Apple Health / Google Health Connect; smarter jet-lag protocol.',
    purpose:
      'You can opt to share specific health records — vaccinations for visa requirements, sleep data for the jet-lag protocol. Each record type is a separate opt-in. We never share health data with insurers or advertisers.',
    collects: ['Only the categories you tick (e.g. immunisations, sleep)'],
    doesNotCollect: ['Full medical history', 'Anything outside your selection'],
    gdprBasis: 'consent',
    storePolicy:
      'Apple HealthKit (special entitlement — review required); Google Health Connect API',
    platforms: ['ios', 'android'],
    requiresStoreDeclaration: true,
    triggeredBy: ['vaccination-hub', 'jet-lag', 'ai-doctor'],
    tier: 'restricted',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── IDENTITY ───────────
  {
    id: 'biometrics',
    category: 'identity',
    icon: Fingerprint,
    label: 'Face ID / Touch ID',
    pitch: 'Unlock your Snomad ID vault and approve high-value AI agent payments.',
    purpose:
      'Biometrics never leave your device — SuperNomad just receives a yes/no signal that you authenticated. Used to unlock the encrypted vault and confirm sensitive actions like agentic payments above your threshold.',
    collects: ['A boolean: did you authenticate?'],
    doesNotCollect: ['Biometric templates', 'Fingerprint or face data'],
    gdprBasis: 'contract',
    storePolicy: 'Apple LocalAuthentication; Android BiometricPrompt — no special declaration',
    platforms: ['ios', 'android'],
    triggeredBy: ['vault', 'payment-options'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── SYSTEM ───────────
  {
    id: 'bluetooth',
    category: 'system',
    icon: Bluetooth,
    label: 'Bluetooth',
    pitch: 'Track your luggage tags & pair with travel devices.',
    purpose:
      'Bluetooth is used only for explicit pairings — luggage trackers, hotel-room locks via your booking app. We never scan ambient BLE beacons.',
    collects: ['Devices you actively pair'],
    doesNotCollect: ['Nearby BLE beacon scans', 'MAC addresses for tracking'],
    gdprBasis: 'consent',
    storePolicy: 'Apple NSBluetoothAlwaysUsageDescription; Play BLUETOOTH_CONNECT',
    platforms: ['ios', 'android'],
    triggeredBy: ['vault'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'background-refresh',
    category: 'system',
    icon: RefreshCw,
    label: 'Background app refresh',
    pitch: 'Keep weather, threat intel, and visa rules fresh even when the app is closed.',
    purpose:
      'Background refresh lets SuperNomad pre-fetch weather, threat updates, and rule changes for your current country. No location is sent during refresh.',
    collects: ['Anonymous fetch of public data'],
    doesNotCollect: ['Location during refresh', 'Personal data'],
    gdprBasis: 'legitimate_interest',
    storePolicy: 'Apple BGTaskScheduler; Play WorkManager — standard',
    platforms: ['ios', 'android'],
    triggeredBy: ['weather-service', 'threats', 'alerts'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── EMAIL & DOCUMENT IMPORT ───────────
  {
    id: 'email-import-google',
    category: 'communications',
    icon: Mail,
    label: 'Gmail — import travel bookings',
    pitch: 'One-tap import of your flight & hotel confirmations from Gmail (90 days default).',
    purpose:
      'You authorize SuperNomad to scan your Gmail for travel-related messages only — flight, hotel, train, car-rental confirmations. We use Google\'s narrow gmail.metadata + gmail.readonly scopes filtered to travel senders. You choose the date range (default: next 90 days; max: 2 years for retrospective travel-history reconstruction). You can revoke access anytime at myaccount.google.com.',
    collects: ['Booking confirmations from known travel senders only'],
    doesNotCollect: ['Personal emails', 'Email metadata for ads', 'Your inbox after disconnect'],
    gdprBasis: 'consent',
    storePolicy:
      'Google API Restricted Scopes — narrow scope, user-initiated. CASA tier-2 audit needed for production gmail.readonly.',
    platforms: ['web', 'ios', 'android'],
    requiresStoreDeclaration: true,
    triggeredBy: ['ai-planner', 'tax-residency', 'travel-timeline'],
    tier: 'restricted',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'email-import-microsoft',
    category: 'communications',
    icon: Mail,
    label: 'Outlook — import travel bookings',
    pitch: 'Same as Gmail, for Outlook / Microsoft 365 mailboxes.',
    purpose:
      'You authorize SuperNomad to scan your Outlook mailbox for travel confirmations only. We use Microsoft Graph Mail.Read scope filtered to travel senders. Date range under your control. Revocable at any time at account.microsoft.com.',
    collects: ['Booking confirmations from known travel senders only'],
    doesNotCollect: ['Personal emails', 'Anything outside the travel filter'],
    gdprBasis: 'consent',
    storePolicy: 'Microsoft Graph permissions — admin consent not required for Mail.Read delegated',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['ai-planner', 'tax-residency', 'travel-timeline'],
    tier: 'restricted',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'email-forward',
    category: 'communications',
    icon: Inbox,
    label: 'Forward-to address',
    pitch: 'Get a private @inbox.supernomad address — forward your bookings, no permissions needed.',
    purpose:
      'You receive a unique private email address. Forward (or auto-forward) flight, hotel, and other travel confirmations to it — SuperNomad parses them into your timeline. Zero device permissions required, works on every platform.',
    collects: ['Only emails you forward to your private address'],
    doesNotCollect: ['Anything you don\'t forward'],
    gdprBasis: 'consent',
    storePolicy: 'No store permission required — server-side only',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['ai-planner', 'tax-residency'],
    tier: 'low',
    purposeVersion: PURPOSE_VERSION,
  },

  // ─────────── DOCUMENT STORAGE ───────────
  {
    id: 'storage-documents',
    category: 'system',
    icon: FileText,
    label: 'File storage access',
    pitch: 'Pick PDFs (passport, visa, insurance) to add to your vault.',
    purpose:
      'You pick specific files via the system file picker. We never browse your file system — only the files you hand us are read.',
    collects: ['Files you actively select'],
    doesNotCollect: ['Folder listings', 'Any file you didn\'t pick'],
    gdprBasis: 'consent',
    storePolicy: 'Standard file-picker — no special declaration',
    platforms: ['web', 'ios', 'android'],
    triggeredBy: ['vault', 'documents'],
    tier: 'standard',
    purposeVersion: PURPOSE_VERSION,
  },
  {
    id: 'phone-state',
    category: 'system',
    icon: Phone,
    label: 'SIM / network country',
    pitch: 'Detect your SIM country to prefill currency, language, and roaming warnings.',
    purpose:
      'On Android we can read the SIM country code (not your phone number) to prefill currency and roaming alerts. iOS provides this through the Carrier API without any permission prompt.',
    collects: ['ISO country code of SIM card'],
    doesNotCollect: ['Phone number', 'IMEI', 'Call logs', 'SMS'],
    gdprBasis: 'legitimate_interest',
    storePolicy:
      'Android READ_PHONE_STATE — restricted; only request if SIM-country is core feature, otherwise use IP geolocation',
    platforms: ['android'],
    triggeredBy: ['currency', 'esim'],
    tier: 'sensitive',
    purposeVersion: PURPOSE_VERSION,
  },
];

export function getPermission(id: PermissionId): PermissionSpec | undefined {
  return PERMISSION_REGISTRY.find((p) => p.id === id);
}

export function getPermissionsForFeature(featureId: string): PermissionSpec[] {
  return PERMISSION_REGISTRY.filter((p) => p.triggeredBy.includes(featureId));
}

export function getPermissionsByCategory(): Record<PermissionCategory, PermissionSpec[]> {
  return PERMISSION_REGISTRY.reduce((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {} as Record<PermissionCategory, PermissionSpec[]>);
}

export const TIER_LABEL: Record<PermissionSpec['tier'], string> = {
  low: 'Low impact',
  standard: 'Standard',
  sensitive: 'Sensitive',
  restricted: 'Restricted — extra review',
};

export const GDPR_BASIS_LABEL: Record<GdprBasis, string> = {
  consent: 'Your explicit consent (Art. 6.1.a)',
  contract: 'Needed to deliver the service (Art. 6.1.b)',
  legal_obligation: 'Required by law (Art. 6.1.c)',
  vital_interest: 'Life-safety (Art. 6.1.d)',
  legitimate_interest: 'Legitimate interest, balanced (Art. 6.1.f)',
};
