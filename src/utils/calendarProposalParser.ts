import { CalendarEventCategory, CalendarEventProposal } from '@/types/calendarEvent';

/**
 * Parse `\`\`\`calendar` JSON blocks the AI emits in chat replies. Each block
 * may contain a single proposal or an array of proposals.
 *
 * Example:
 *   \`\`\`calendar
 *   { "title": "Padel session with Marcus",
 *     "start": "2026-04-25T18:00",
 *     "category": "sport",
 *     "location": "Hurlingham Club" }
 *   \`\`\`
 */
export function parseCalendarBlocks(content: string): {
  text: string;
  proposals: CalendarEventProposal[][];
} {
  const blockRegex = /```calendar\s*\n([\s\S]*?)```/g;
  const proposals: CalendarEventProposal[][] = [];
  const text = content.replace(blockRegex, (_, raw) => {
    try {
      const cleaned = String(raw)
        .trim()
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\x00-\x1F\x7F]/g, '');
      const parsed = JSON.parse(cleaned);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const items: CalendarEventProposal[] = list
        .filter((p) => p && typeof p === 'object' && p.title && p.start)
        .map((p: any) => ({
          title: String(p.title),
          start: normalizeStart(String(p.start)),
          end: p.end ? normalizeStart(String(p.end)) : undefined,
          category: (p.category as CalendarEventCategory) || 'reminder',
          location: p.location ? String(p.location) : undefined,
          notes: p.notes ? String(p.notes) : undefined,
          provider: p.provider ? String(p.provider) : undefined,
          participants: Array.isArray(p.participants) ? p.participants.map(String) : undefined,
          reminders: Array.isArray(p.reminders) ? p.reminders : undefined,
        }));
      if (items.length > 0) {
        proposals.push(items);
        return `{{CALENDAR_PROPOSAL_${proposals.length - 1}}}`;
      }
    } catch (err) {
      console.warn('parseCalendarBlocks failed:', err);
    }
    return '';
  });
  return { text, proposals };
}

function normalizeStart(value: string): string {
  // If it's already a full ISO, return as-is
  if (/T\d{2}:\d{2}/.test(value)) return value;
  // YYYY-MM-DD only → add midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T09:00`;
  return value;
}
