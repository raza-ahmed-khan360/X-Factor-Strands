/**
 * X-Factor Peptides - Comprehensive Security & Sanitization Utility
 * Provides protection against SQL Injection, Cross-Site Scripting (XSS),
 * Header Injection, ReDoS, and malicious input payload tampering.
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Escapes unsafe characters for secure rendering in HTML and Email templates
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\`/g, '&#x60;');
}

/**
 * Strips known SQL injection keywords, dangerous symbols, and control characters
 */
export function sanitizeSqlInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  let cleaned = input.trim();
  
  // Remove null bytes and non-printable control characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove dangerous SQL comment characters and stacked query delimiters
  cleaned = cleaned.replace(/(--|;|\/\*|\*\/|@@|char\(|exec\s+|drop\s+table|insert\s+into|delete\s+from|union\s+select)/gi, '');
  
  return cleaned;
}

/**
 * General string sanitization with length bounds and SQL/XSS prevention
 */
export function sanitizeString(input: unknown, maxLength: number = 255): string {
  if (typeof input !== 'string') return '';
  
  let cleaned = sanitizeSqlInput(input);
  
  // Strip HTML tag syntax
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');
  
  // Limit length to prevent buffer/payload overflow
  return cleaned.slice(0, maxLength).trim();
}

/**
 * Strict Email Sanitization (prevents SMTP header injection \r \n and validates structure)
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  
  // Strip CRLF to completely prevent SMTP Header Injection
  const cleaned = email.replace(/[\r\n]/g, '').trim().toLowerCase();
  
  // Strict RFC-5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(cleaned) || cleaned.length > 254) {
    throw new Error('Invalid email address format');
  }
  
  return cleaned;
}

/**
 * Strict Phone Number Sanitization
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  
  // Allow only numbers, spaces, +, -, (, ), .
  const cleaned = phone.replace(/[^0-9+\-\s().]/g, '').trim();
  return cleaned.slice(0, 30);
}

/**
 * Strict Order Number Sanitization (alphanumeric + hyphen only)
 */
export function sanitizeOrderNumber(orderNumber: unknown): string {
  if (typeof orderNumber !== 'string') return '';
  const cleaned = orderNumber.replace(/[^a-zA-Z0-9\-_]/g, '').trim().toUpperCase();
  return cleaned.slice(0, 32);
}

/**
 * Strict Transaction / Reference ID Sanitization
 */
export function sanitizeTransactionId(txnId: unknown): string {
  if (typeof txnId !== 'string') return '';
  const cleaned = txnId.replace(/[^a-zA-Z0-9\-_#. ]/g, '').trim();
  return cleaned.slice(0, 80);
}

/**
 * Strict Numeric Sanitization
 */
export function sanitizeNumber(val: unknown, min: number = 0, max: number = 1000000, fallback: number = 0): number {
  const num = Number(val);
  if (isNaN(num)) return fallback;
  if (num < min) return min;
  if (num > max) return max;
  return Number(num.toFixed(2));
}

/**
 * Strict File MIME & Extension Verification for uploads
 */
export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  
  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WEBP images or PDF files are allowed.' };
  }
  
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: 'Invalid file extension detected.' };
  }
  
  // Enforce maximum 10MB file size
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 10MB limit.' };
  }
  
  return { valid: true };
}
