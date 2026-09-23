/**
 * Product-owner kill switch for proactive friend and SportBuddy discovery.
 * It is intentionally fail-closed and cannot be changed by a user preference.
 */
export const SOCIAL_INTRODUCTIONS_PAUSED = true;

const PAUSED_FEATURE_IDS = new Set(['local-nomads']);

export function isPausedSocialIntroductionFeature(featureId: string): boolean {
  return SOCIAL_INTRODUCTIONS_PAUSED && PAUSED_FEATURE_IDS.has(featureId);
}