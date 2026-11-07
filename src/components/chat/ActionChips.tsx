import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Calendar, Phone, ExternalLink, Bookmark, Clock, FileCheck,
  CreditCard, Plane, Hotel, Car, ShieldCheck, MapPin, Forward, Share2,
  Download, MessageSquare, type LucideIcon,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// Concierge Action Chips
// ───────────────────────────────────────────────────────────
// Replaces the "Would you like me to…?" question pattern.
// Every assistant reply ends with 1-3 chips the user can tap.
//
// Wire format the AI emits at the END of any reply:
//
//   [[CHIPS]]
//   - Book this | book | flight_lhr_jfk_2026-06-01
//   - Add to calendar | calendar | flight_lhr_jfk_2026-06-01
//   - Hold for 24h | hold | flight_lhr_jfk_2026-06-01
//   [[/CHIPS]]
//
// or single-line:  [[CHIPS: Book this|book|id;; Add to calendar|calendar|id]]
// ═══════════════════════════════════════════════════════════

export type ActionChipKind =
  | 'book' | 'calendar' | 'hold' | 'forward' | 'share' | 'call'
  | 'open' | 'pay' | 'save' | 'remind' | 'verify' | 'directions'
  | 'flight' | 'hotel' | 'car' | 'download' | 'reply';

export interface ActionChip {
  label: string;
  kind: ActionChipKind;
  payload?: string;          // id / url / freeform string
  variant?: 'default' | 'primary' | 'outline';
}

const KIND_ICON: Record<ActionChipKind, LucideIcon> = {
  book:       Bookmark,
  calendar:   Calendar,
  hold:       Clock,
  forward:    Forward,
  share:      Share2,
  call:       Phone,
  open:       ExternalLink,
  pay:        CreditCard,
  save:       FileCheck,
  remind:     Clock,
  verify:     ShieldCheck,
  directions: MapPin,
  flight:     Plane,
  hotel:      Hotel,
  car:        Car,
  download:   Download,
  reply:      MessageSquare,
};

interface ActionChipsProps {
  chips: ActionChip[];
  onAction: (chip: ActionChip) => void;
  disabled?: boolean;
}

/** Render action chips below an assistant message. Max 3 — enforced. */
export const ActionChips: React.FC<ActionChipsProps> = ({ chips, onAction, disabled = false }) => {
  if (!chips || chips.length === 0) return null;
  const limited = chips.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-1.5 mt-2 not-prose">
      {limited.map((c, i) => {
        const Icon = KIND_ICON[c.kind] || ExternalLink;
        const isPrimary = c.variant === 'primary' || i === 0;
        return (
          <Button
            key={`${c.label}-${i}`}
            size="sm"
            variant={isPrimary ? 'default' : 'outline'}
            className="min-h-11 h-auto whitespace-normal text-xs gap-1.5 rounded-full px-3 py-2"
            disabled={disabled}
            onClick={() => onAction(c)}
          >
            <Icon className="h-3 w-3" />
            {c.label}
          </Button>
        );
      })}
    </div>
  );
};

// ─── Parser ───────────────────────────────────────────────
/**
 * Extracts chips from assistant text. Supports:
 *   [[CHIPS]]\n- Label | kind | payload\n[[/CHIPS]]
 *   [[CHIPS: Label|kind|payload;; Label|kind]]
 * Returns the cleaned text (chips block stripped) and the chip array.
 */
export function parseActionChips(content: string): { text: string; chips: ActionChip[] } {
  if (!content) return { text: content, chips: [] };
  const chips: ActionChip[] = [];

  // Multi-line block
  const blockRe = /\[\[CHIPS\]\]([\s\S]*?)\[\[\/CHIPS\]\]/i;
  let text = content.replace(blockRe, (_, body: string) => {
    body.split(/\r?\n/).forEach(line => {
      const m = line.match(/^[-*]\s*(.+)$/);
      if (m) pushChip(chips, m[1]);
    });
    return '';
  });

  // Inline form
  const inlineRe = /\[\[CHIPS:\s*([^\]]+)\]\]/i;
  text = text.replace(inlineRe, (_, body: string) => {
    body.split(/;;/).forEach(part => pushChip(chips, part.trim()));
    return '';
  });

  return { text: text.trim(), chips };
}

function pushChip(out: ActionChip[], raw: string) {
  const parts = raw.split('|').map(s => s.trim());
  if (parts.length === 0) return;
  const [label, kindRaw = 'reply', ...payloadParts] = parts;
  if (!label) return;
  const kind = Object.prototype.hasOwnProperty.call(KIND_ICON, kindRaw) ? (kindRaw as ActionChipKind) : 'reply';
  out.push({ label, kind, payload: payloadParts.join('|') || undefined });
}

export default ActionChips;
