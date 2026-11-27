const BLOCKED_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'test.org',
  'test.net',
  'invalid',
  'localhost',
  'localdomain',
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwaway.email',
  'yopmail.com',
  '10minutemail.com',
  'trashmail.com',
  'fakeinbox.com',
  'sharklasers.com',
]);

const BLOCKED_TLDS = new Set(['test', 'example', 'invalid', 'localhost', 'local']);

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'protonmial.com': 'protonmail.com',
};

const EMAIL_REGEX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export interface EmailValidationResult {
  valid: boolean;
  normalized: string;
  error?: string;
  suggestion?: string;
}

export function validateDeliverableEmail(raw: string): EmailValidationResult {
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
    return { valid: false, normalized, error: 'Please enter a valid email address.' };
  }

  const parts = normalized.split('@');
  const local = parts[0] ?? '';
  const domain = parts[1] ?? '';
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return { valid: false, normalized, error: 'Please enter a valid email address.' };
  }

  const tld = domain.split('.').pop() ?? '';
  if (tld.length < 2 || BLOCKED_TLDS.has(tld) || BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      normalized,
      error: 'Please use a real, active email address (test or disposable domains are not accepted).',
    };
  }

  const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];
  if (suggestedDomain) {
    const suggestion = `${local}@${suggestedDomain}`;
    return {
      valid: false,
      normalized,
      suggestion,
      error: `Did you mean ${suggestion}? Please check your email address for typos.`,
    };
  }

  return { valid: true, normalized };
}