// ═══════════════════════════════════════════════════════════
// VIJ Business Email Validator
// ═══════════════════════════════════════════════════════════

const PERSONAL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'live.com', 'msn.com',
  'rediffmail.com', 'tutanota.com',
];

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com',
  'throwaway.email', 'yopmail.com', '10minutemail.com',
  'trashmail.com', 'sharklasers.com',
];

export interface EmailValidationResult {
  isValid: boolean;
  domain: string;
  companyNameGuess: string;
  errorMessage?: string;
  errorType?: 'personal' | 'disposable' | 'invalid';
}

export function validateBusinessEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      domain: '',
      companyNameGuess: '',
      errorMessage: 'Please enter a valid email address.',
      errorType: 'invalid',
    };
  }

  const domain = trimmed.split('@')[1];

  // Personal email check
  if (PERSONAL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      domain,
      companyNameGuess: '',
      errorMessage: 'Please use your official company email (e.g., name@company.com). Personal emails like Gmail, Yahoo, or Outlook are not accepted.',
      errorType: 'personal',
    };
  }

  // Disposable email check
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      domain,
      companyNameGuess: '',
      errorMessage: 'Disposable email addresses are not allowed. Please use your real company email.',
      errorType: 'disposable',
    };
  }

  // Extract company name from domain
  const domainParts = domain.split('.');
  const companyNameGuess = domainParts[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    isValid: true,
    domain,
    companyNameGuess,
  };
}
