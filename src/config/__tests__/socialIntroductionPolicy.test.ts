import { describe, expect, it } from 'vitest';
import {
  SOCIAL_INTRODUCTIONS_PAUSED,
  isPausedSocialIntroductionFeature,
  safeSectionDuringSocialPause,
} from '../socialIntroductionPolicy';

describe('social introduction pause', () => {
  it('is globally enabled and cannot be bypassed by feature preferences', () => {
    expect(SOCIAL_INTRODUCTIONS_PAUSED).toBe(true);
    expect(isPausedSocialIntroductionFeature('local-nomads')).toBe(true);
    expect(isPausedSocialIntroductionFeature('weather-service')).toBe(false);
    expect(safeSectionDuringSocialPause('local-nomads')).toBe('dashboard');
    expect(safeSectionDuringSocialPause('nomad-chat')).toBe('nomad-chat');
  });
});