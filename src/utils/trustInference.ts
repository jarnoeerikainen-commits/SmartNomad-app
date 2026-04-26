import { ConfidenceLevel } from '@/contexts/TrustContext';

/**
 * Infer the confidence level of an AI response based on its content.
 * Tax, legal, and financial topics auto-downgrade unless citing specific sources.
 */
export function inferConfidence(content: string): ConfidenceLevel {
  const lower = content.toLowerCase();

  // High-risk domains: tax, legal, medical, financial
  const highRiskDomains = [
    'tax residency', 'tax obligation', 'tax treaty', 'capital gains',
    'legal advice', 'immigration law', 'visa requirement',
    'medical advice', 'prescription', 'diagnosis',
    'investment advice', 'financial planning',
  ];

  const isHighRisk = highRiskDomains.some(d => lower.includes(d));

  // Check for citation/source indicators
  const hasCitation = /(?:according to|source:|official|government website|verified|as of \d{4}|law \d+|article \d+|directive \d+)/i.test(content);

  // Check for uncertainty / unknown / search-offer language
  const hasUncertainty = /(?:i'm not sure|this may vary|please verify|consult a|check with|i believe|it's possible|generally|typically|might|could be|i don't know|i do not know|i don't have|i do not have|cannot verify|can't verify|want me to search|search further|verify with)/i.test(content);

  if (isHighRisk && !hasCitation) return 'needs_review';
  if (hasUncertainty) return 'predictive';
  if (isHighRisk && hasCitation) return 'verified';

  return 'verified';
}

/**
 * Parse [STEP: ...] markers from streamed AI content.
 * Returns the clean content and any extracted thinking steps.
 */
export function parseThinkingSteps(content: string): { cleanContent: string; steps: string[] } {
  const steps: string[] = [];
  const cleanContent = content.replace(/\[STEP:\s*([^\]]+)\]/g, (_, step) => {
    steps.push(step.trim());
    return '';
  });
  return { cleanContent: cleanContent.trim(), steps };
}
