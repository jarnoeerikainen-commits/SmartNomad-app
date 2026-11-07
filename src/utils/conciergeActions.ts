import type { ActionChip } from '@/components/chat/ActionChips';

export function safeActionUrl(payload?: string): string | undefined {
  if (!payload) return undefined;
  try {
    const url = new URL(payload);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

const normalize = (value: string) => value.toLocaleLowerCase().normalize('NFKC')
  .replace(/[.!?,:;]+$/g, '').replace(/\s+/g, ' ').trim();

/** Only resolve an unambiguous choice in the latest completed reply. */
export function matchConciergeChoice(text: string, chips: ActionChip[]): ActionChip | undefined {
  const value = normalize(text).replace(/^(?:please\s+)?(?:tap|click|choose|select)\s+/, '').replace(/\s+please$/, '');
  const exact = chips.filter(chip => normalize(chip.label) === value);
  if (exact.length === 1) return exact[0];
  const ordinal = value.match(/^(?:(?:option|number)\s+)?(1|2|3|one|two|three|first|second|third)(?:\s+option)?$/);
  if (!ordinal) return undefined;
  const index = ['1', 'one', 'first'].includes(ordinal[1]) ? 0
    : ['2', 'two', 'second'].includes(ordinal[1]) ? 1 : 2;
  return chips.slice(0, 3)[index];
}

export function buildConciergeActionRequest(chip: ActionChip, source: string): string {
  return `I selected "${chip.label}" (${chip.kind}) from your offered options.${chip.payload ? ` Reference: ${chip.payload}.` : ''}\n`
    + `Original reply:\n${source}\n\n`
    + 'Carry out this selected next step using verified app capabilities. Ask for missing details when needed. '
    + 'For bookings, payments, holds, calls, calendar changes, or submitted data, show the real review/confirmation control; '
    + 'never claim it completed without a verified result. If unavailable, explain clearly and offer a supported alternative.';
}