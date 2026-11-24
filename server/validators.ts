export function cleanString(
  value: unknown,
  maxLength = 500,
  allowNewlines = false,
): string {
  if (typeof value !== 'string') return '';
  let text = value.trim();
  if (!allowNewlines) {
    text = text.replace(/[\r\n\t]+/g, ' ');
  }
  return text.slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isSafeAssetUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 1200) return false;

  // Reject path traversal and dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return false;
  }

  // Allow safe relative root-bound paths (/assets/..., /src/assets/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return !trimmed.includes('..') && !trimmed.includes('\\');
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function slugifyLower(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function normalizeCategoryId(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 /&-]+/g, '')
    .trim()
    .slice(0, 48);
}

export const ALLOWED_TYPOLOGIES = [
  'SCULPTURE',
  'INSTALLATION',
  'SITE & PUBLIC',
  'SERIES',
] as const;

export const ALLOWED_JOURNAL_CATEGORIES = [
  'EXHIBITION',
  'PUBLICATION',
] as const;

export const ALLOWED_ENQUIRY_STATUSES = [
  'NEW',
  'READ',
  'ARCHIVED',
] as const;
