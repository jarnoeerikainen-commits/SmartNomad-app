import { describe, expect, it } from 'vitest';
import { validateDeliverableEmail } from '@/utils/emailValidation';

describe('validateDeliverableEmail', () => {
  it('accepts and normalizes valid email addresses', () => {
    const res = validateDeliverableEmail('  Jane.Doe@SuperNomad.app  ');
    expect(res.valid).toBe(true);
    expect(res.normalized).toBe('jane.doe@supernomad.app');
  });

  it('rejects malformed addresses', () => {
    expect(validateDeliverableEmail('not-an-email').valid).toBe(false);
    expect(validateDeliverableEmail('user@localhost').valid).toBe(false);
    expect(validateDeliverableEmail('a..b@gmail.com').valid).toBe(false);
  });

  it('rejects reserved test and disposable domains', () => {
    expect(validateDeliverableEmail('john@example.com').valid).toBe(false);
    expect(validateDeliverableEmail('qa@test.com').valid).toBe(false);
    expect(validateDeliverableEmail('user@mailinator.com').valid).toBe(false);
    expect(validateDeliverableEmail('user@foo.invalid').valid).toBe(false);
  });

  it('catches common domain typos and suggests a correction', () => {
    const res = validateDeliverableEmail('traveler@gmial.com');
    expect(res.valid).toBe(false);
    expect(res.suggestion).toBe('traveler@gmail.com');
    expect(res.error).toContain('traveler@gmail.com');
  });
});