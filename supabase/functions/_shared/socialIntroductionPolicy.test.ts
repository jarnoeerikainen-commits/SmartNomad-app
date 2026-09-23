import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import {
  SOCIAL_INTRODUCTIONS_PAUSED,
  isPausedSocialIntroductionRequest,
} from './socialIntroductionPolicy.ts';

Deno.test('friend and SportBuddy introductions stay paused', () => {
  assertEquals(SOCIAL_INTRODUCTIONS_PAUSED, true);
  assertEquals(isPausedSocialIntroductionRequest('match'), true);
  assertEquals(isPausedSocialIntroductionRequest('ai_nudge'), true);
  assertEquals(isPausedSocialIntroductionRequest('conversation'), false);
  assertEquals(isPausedSocialIntroductionRequest('replies'), false);
});