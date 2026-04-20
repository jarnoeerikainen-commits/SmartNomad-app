// ═══════════════════════════════════════════════════════════
// Concierge → Human Support Escalation Parser
// ───────────────────────────────────────────────────────────
// Detects [ESCALATE: reason] markers emitted by the AI when
// it is not 100% confident, and returns the cleaned content
// plus the reason so the UI can render a support handoff card.
// ═══════════════════════════════════════════════════════════

export interface EscalationParseResult {
  cleanContent: string;
  escalation: { reason: string } | null;
}

const ESCALATE_RE = /\[ESCALATE:\s*([^\]]+)\]/i;

export function parseEscalation(content: string): EscalationParseResult {
  const match = content.match(ESCALATE_RE);
  if (!match) return { cleanContent: content, escalation: null };
  const reason = match[1].trim();
  const cleanContent = content.replace(ESCALATE_RE, '').trim();
  return { cleanContent, escalation: { reason } };
}
