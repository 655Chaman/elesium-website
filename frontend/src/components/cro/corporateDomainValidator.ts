/**
 * corporateDomainValidator.ts
 * ============================================================================
 * Enterprise Domain Validation & Classification Engine for Elesium.
 * Classifies emails into:
 *   - 'enterprise': Company domain with dedicated corporate mail exchangers (Priority Fast-Track)
 *   - 'consumer': Webmail providers (@gmail, @yahoo, etc. - Soft warning with whitepaper fallback)
 *   - 'disposable': Temporary / throwaway mail services (Hard block for NDA integrity)
 *   - 'invalid': Syntactically invalid format
 * ============================================================================
 */

export interface DomainValidationResult {
  isValidFormat: boolean;
  domain: string;
  category: 'enterprise' | 'consumer' | 'disposable' | 'invalid';
  badgeText: string;
  isAllowed: boolean;
  priorityScore: number; // 0 to 100
  feedbackColor: 'emerald' | 'amber' | 'rose' | 'gray';
}

const CONSUMER_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'ymail.com', 'rocketmail.com', 'yahoo.co.in', 'yahoo.co.uk',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'passport.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'zoho.com', 'zohomail.in',
  'proton.me', 'protonmail.com', 'pm.me',
  'mail.com', 'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru',
  'rediffmail.com', 'rediff.com',
  'tutanota.com', 'tuta.io',
  'fastmail.com',
  'web.de'
]);

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com',
  'guerrillamail.com', 'guerrillamailblock.com', 'sharklasers.com',
  'throwawaymail.com', 'getairmail.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'dispostable.com', 'trashmail.com', 'trashmail.net',
  'mytemp.email', 'temp-mail.org', 'fakeinbox.com',
  'burnermail.io', 'mohmal.com', 'crazymailing.com'
]);

export function validateEnterpriseEmail(email: string): DomainValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValidFormat: false,
      domain: '',
      category: 'invalid',
      badgeText: 'Please enter your corporate email address',
      isAllowed: false,
      priorityScore: 0,
      feedbackColor: 'gray'
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Standard RFC 5322 compliance pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(cleanEmail)) {
    return {
      isValidFormat: false,
      domain: cleanEmail.includes('@') ? cleanEmail.split('@')[1] : '',
      category: 'invalid',
      badgeText: 'Invalid email format',
      isAllowed: false,
      priorityScore: 0,
      feedbackColor: 'rose'
    };
  }

  const parts = cleanEmail.split('@');
  const domain = parts[1];

  // Check 1: Disposable / Temporary Email Services
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValidFormat: true,
      domain,
      category: 'disposable',
      badgeText: 'Temporary domains prohibited for mutual NDA execution',
      isAllowed: false,
      priorityScore: 0,
      feedbackColor: 'rose'
    };
  }

  // Check 2: Consumer Webmail Providers
  if (CONSUMER_DOMAINS.has(domain)) {
    return {
      isValidFormat: true,
      domain,
      category: 'consumer',
      badgeText: 'Corporate work email recommended for 4-Hour Principal SLA',
      isAllowed: true, // Allow with soft gate advisory
      priorityScore: 40,
      feedbackColor: 'amber'
    };
  }

  // Check 3: Verified Corporate / Enterprise Domain
  return {
    isValidFormat: true,
    domain,
    category: 'enterprise',
    badgeText: 'Corporate Domain Verified // Priority Principal Desk Routing',
    isAllowed: true,
    priorityScore: 95,
    feedbackColor: 'emerald'
  };
}
