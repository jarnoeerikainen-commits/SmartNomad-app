// ═══════════════════════════════════════════════════════════════════════════
// Feature Auto-Sync — derives voice patterns, AI intent mappings, and the
// AI feature catalog directly from the FEATURE_REGISTRY + FEATURE_ALIASES.
// ───────────────────────────────────────────────────────────────────────────
// Why this exists
//   • Adding a feature should "just work" — voice navigation, Concierge
//     awareness, and Support AI knowledge update automatically.
//   • A single source of truth (registry + aliases) prevents drift between
//     the sidebar, the voice control map, the intent router, and the AI.
//
// Public API
//   • buildAutoVoicePatterns()   – patterns to merge into VoiceControlContext
//   • buildAutoIntentMappings()  – mappings to merge into IntentDiscoveryService
//   • buildFeatureCatalogForAI() – Markdown catalog injected into AI prompts
//   • getAllSearchTermsForFeature() – every searchable term for one feature
// ═══════════════════════════════════════════════════════════════════════════

import { FEATURE_REGISTRY, FeatureItem, CATEGORY_LABELS } from './featureRegistry';
import { FEATURE_ALIASES } from './featureAliases';

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Escape regex special chars so labels with punctuation become safe patterns. */
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns a deduped list of every term we should match for a given feature:
 * id, label words, explicit aliases (incl. multilingual), and the feature's
 * inline `aliases` field if set on the registry item.
 */
export function getAllSearchTermsForFeature(feature: FeatureItem): string[] {
  const terms = new Set<string>();

  // 1. The feature ID itself (kebab → space)
  terms.add(feature.id.replace(/-/g, ' ').toLowerCase());

  // 2. The label (e.g. "Tax & Expense Hub" → "tax expense hub" + "tax", "expense", "hub")
  const labelClean = feature.label
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (labelClean) terms.add(labelClean);

  // 3. Explicit aliases from FEATURE_ALIASES
  const aliasList = FEATURE_ALIASES[feature.id] || [];
  for (const a of aliasList) {
    if (a && a.trim()) terms.add(a.toLowerCase().trim());
  }

  // 4. Inline aliases on the registry item
  for (const a of feature.aliases || []) {
    if (a && a.trim()) terms.add(a.toLowerCase().trim());
  }

  return Array.from(terms);
}

// ─── Voice patterns ───────────────────────────────────────────────────────

export interface AutoVoicePattern {
  patterns: RegExp[];
  action: string;       // e.g. "section:expenses"
  description: string;  // e.g. "Tax & Expense Hub"
}

/**
 * Generates one VoiceCommand per feature, with patterns covering English +
 * every alias (which is where the multilingual coverage lives). The patterns
 * are word-boundary anchored so short tokens don't false-match.
 */
export function buildAutoVoicePatterns(): AutoVoicePattern[] {
  const out: AutoVoicePattern[] = [];

  for (const feature of FEATURE_REGISTRY) {
    const terms = getAllSearchTermsForFeature(feature)
      // Voice triggers should be ≥ 3 chars to avoid spurious matches like "ai"
      .filter((t) => t.length >= 3);

    if (terms.length === 0) continue;

    // Build one regex per term. For Latin-script terms we use \b boundaries;
    // for non-Latin (CJK/Arabic/etc.) we omit \b because \b doesn't work there.
    const patterns: RegExp[] = terms.map((term) => {
      const escaped = escapeRegex(term).replace(/\s+/g, '\\s+');
      const isLatin = /^[\x20-\x7E]+$/.test(term);
      return isLatin
        ? new RegExp(`\\b${escaped}\\b`, 'i')
        : new RegExp(escaped, 'i');
    });

    out.push({
      patterns,
      action: `section:${feature.id}`,
      description: feature.label,
    });
  }

  return out;
}

// ─── Intent mappings (Concierge / Support AI tool routing) ────────────────

export interface AutoIntentMapping {
  featureId: string;
  category: string;
  keywords: string[];
  synonyms: string[];
  contextTriggers: string[];
}

export function buildAutoIntentMappings(): AutoIntentMapping[] {
  return FEATURE_REGISTRY.map((feature) => {
    const terms = getAllSearchTermsForFeature(feature);
    // Split the label into individual words to use as keywords
    const labelWords = feature.label
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with'].includes(w));

    return {
      featureId: feature.id,
      category: feature.category,
      keywords: Array.from(new Set([...labelWords, ...terms.slice(0, 8)])),
      synonyms: terms.slice(0, 12),
      contextTriggers: [
        feature.label.toLowerCase(),
        `open ${feature.label.toLowerCase()}`,
        `go to ${feature.label.toLowerCase()}`,
        `show me ${feature.label.toLowerCase()}`,
      ],
    };
  });
}

// ─── AI prompt catalog ────────────────────────────────────────────────────

/**
 * Returns a compact Markdown catalog of every feature, grouped by category,
 * with the navigation ID + a one-line description + key aliases. Designed to
 * be injected straight into AI system prompts so the model can answer "where
 * do I find X?" and emit `[NAVIGATE:feature-id]` correctly.
 */
export function buildFeatureCatalogForAI(): string {
  const grouped: Record<string, string[]> = {};

  for (const feature of FEATURE_REGISTRY) {
    const cat = CATEGORY_LABELS[feature.category] || feature.category;
    if (!grouped[cat]) grouped[cat] = [];

    const aliases = (FEATURE_ALIASES[feature.id] || [])
      .filter((a) => /^[\x20-\x7E]+$/.test(a)) // Latin-only for prompt brevity
      .slice(0, 6);

    const aliasStr = aliases.length ? ` _(aka: ${aliases.join(', ')})_` : '';
    grouped[cat].push(
      `- \`${feature.id}\` — **${feature.label}**: ${feature.description}${aliasStr}`,
    );
  }

  let out = '';
  for (const [cat, items] of Object.entries(grouped)) {
    out += `\n**${cat}**\n${items.join('\n')}\n`;
  }
  return out.trim();
}

/**
 * Compact JSON-ish list (id|label) used by support-ai and concierge for fast
 * scanning. Use this when prompt budget is tight.
 */
export function buildCompactFeatureList(): string {
  return FEATURE_REGISTRY
    .map((f) => `${f.id}: ${f.label}`)
    .join(' | ');
}

// ─── QA / sanity checks ───────────────────────────────────────────────────

/**
 * Returns features that would have *zero* useful voice/AI coverage so we can
 * surface them in dev tooling and tests.
 */
export function findFeaturesWithWeakCoverage(): FeatureItem[] {
  return FEATURE_REGISTRY.filter((f) => {
    const terms = getAllSearchTermsForFeature(f).filter((t) => t.length >= 3);
    return terms.length < 2; // need at least the id + one alias/label word
  });
}
