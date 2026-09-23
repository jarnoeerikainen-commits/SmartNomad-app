export const SOCIAL_INTRODUCTIONS_PAUSED = true;

export function isPausedSocialIntroductionRequest(typeOrMode: string): boolean {
  return SOCIAL_INTRODUCTIONS_PAUSED && ['match', 'ai_nudge'].includes(typeOrMode);
}