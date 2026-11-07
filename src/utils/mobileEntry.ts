export const DEMO_APP_ENTRY = '/app?demo=1&entry=concierge';

export function getInitialAppTab(isMobile: boolean, search: string): 'concierge' | 'home' {
  return isMobile || new URLSearchParams(search).get('entry') === 'concierge' ? 'concierge' : 'home';
}

export function getMobileConciergeViewport(height: number, offsetTop: number, layoutHeight: number) {
  const keyboardOpen = layoutHeight - height > 120;
  return { top: Math.max(0, offsetTop), height: Math.max(0, height), keyboardOpen };
}

const RESTRICTED_SECTIONS = new Set([
  'payment-options', 'award-cards', 'digital-banks', 'money-transfers', 'digital-money',
  'emergency-cards', 'marketplace', 'social-chat', 'nomad-chat', 'local-nomads',
]);

export function needsAdultAccess(section: string): boolean {
  return RESTRICTED_SECTIONS.has(section);
}

export function classifyBirthYear(year: number, currentYear: number): 'adult' | 'teen' | 'child' | null {
  if (!Number.isInteger(year) || year < 1920 || year > currentYear) return null;
  const age = currentYear - year;
  return age >= 18 ? 'adult' : age >= 16 ? 'teen' : 'child';
}