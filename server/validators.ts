import { isCloudinaryConfigured, isTrustedCloudinaryUrl } from './cloudinary.ts';

export function cleanString(
  value: unknown,
  maxLength = 500,
  allowNewlines = false,
): string {
  if (typeof value !== 'string') return '';
  // Strip unsafe ASCII control characters (preserving \n/\r only when allowNewlines is true)
  let text = value
    .replace(
      allowNewlines
        ? /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g
        : /[\x00-\x1F\x7F]/g,
      ' ',
    )
    .trim();
  if (!allowNewlines) {
    text = text.replace(/[\r\n\t]+/g, ' ');
  }
  return text.slice(0, maxLength);
}

export function normalizeAdminPath(raw?: string): string {
  const DEFAULT_PATH = '/atelier-vs-7k9m2x';
  const trimmed = (raw || '').trim();
  if (!trimmed) return DEFAULT_PATH;
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const cleaned = withSlash.replace(/\/+$/, '');
  if (
    !cleaned ||
    cleaned === '/' ||
    cleaned === '/admin' ||
    cleaned.startsWith('/api') ||
    cleaned.startsWith('/assets') ||
    !/^\/[a-zA-Z0-9/_-]+$/.test(cleaned)
  ) {
    return DEFAULT_PATH;
  }
  return cleaned;
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isBuiltInAssetPath(trimmed: string): boolean {
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return false;
  if (trimmed.includes('..') || trimmed.includes('\\')) return false;
  return (
    trimmed.startsWith('/assets/') || trimmed.startsWith('/src/assets/')
  );
}

export function isSafeAssetUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 1200) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return false;
  }

  if (isBuiltInAssetPath(trimmed)) {
    return true;
  }

  // External image URLs must belong to our configured Cloudinary cloud name
  if (isCloudinaryConfigured()) {
    return isTrustedCloudinaryUrl(trimmed);
  }

  return false;
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
