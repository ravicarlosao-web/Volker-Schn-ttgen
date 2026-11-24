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

type ContentLocale = 'pt' | 'fr';
const CONTENT_LOCALES: ContentLocale[] = ['pt', 'fr'];

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sanitizeCategoryTranslations(raw: unknown) {
  if (!isPlainRecord(raw)) return undefined;
  const out: Partial<
    Record<ContentLocale, { title?: string; categoryLine?: string; metaLine?: string }>
  > = {};

  for (const locale of CONTENT_LOCALES) {
    const entry = raw[locale];
    if (!isPlainRecord(entry)) continue;
    const title = cleanString(entry.title, 80);
    const categoryLine = cleanString(entry.categoryLine, 160);
    const metaLine = cleanString(entry.metaLine, 160);
    const locObj: { title?: string; categoryLine?: string; metaLine?: string } = {};
    if (title) locObj.title = title;
    if (categoryLine) locObj.categoryLine = categoryLine;
    if (metaLine) locObj.metaLine = metaLine;
    if (Object.keys(locObj).length > 0) {
      out[locale] = locObj;
    }
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

export function sanitizeProjectTranslations(
  raw: unknown,
  fallbackLabels: [string, string, string] = ['Material', 'Form', 'Context'],
) {
  if (!isPlainRecord(raw)) return undefined;
  const out: Partial<
    Record<
      ContentLocale,
      {
        title?: string;
        categoryLine?: string;
        medium?: string;
        context?: string;
        lead?: string;
        steps?: [
          { label: string; text: string },
          { label: string; text: string },
          { label: string; text: string },
        ];
      }
    >
  > = {};

  for (const locale of CONTENT_LOCALES) {
    const entry = raw[locale];
    if (!isPlainRecord(entry)) continue;

    const title = cleanString(entry.title, 160);
    const categoryLine = cleanString(entry.categoryLine, 160);
    const medium = cleanString(entry.medium, 160);
    const context = cleanString(entry.context, 160);
    const lead = cleanString(entry.lead, 600, true);

    const locObj: {
      title?: string;
      categoryLine?: string;
      medium?: string;
      context?: string;
      lead?: string;
      steps?: [
        { label: string; text: string },
        { label: string; text: string },
        { label: string; text: string },
      ];
    } = {};

    if (title) locObj.title = title;
    if (categoryLine) locObj.categoryLine = categoryLine;
    if (medium) locObj.medium = medium;
    if (context) locObj.context = context;
    if (lead) locObj.lead = lead;

    if (Array.isArray(entry.steps)) {
      const parsedSteps: [
        { label: string; text: string },
        { label: string; text: string },
        { label: string; text: string },
      ] = [
        {
          label: cleanString(entry.steps[0]?.label, 60) || fallbackLabels[0],
          text: cleanString(entry.steps[0]?.text, 600, true),
        },
        {
          label: cleanString(entry.steps[1]?.label, 60) || fallbackLabels[1],
          text: cleanString(entry.steps[1]?.text, 600, true),
        },
        {
          label: cleanString(entry.steps[2]?.label, 60) || fallbackLabels[2],
          text: cleanString(entry.steps[2]?.text, 600, true),
        },
      ];
      if (parsedSteps.some((s) => Boolean(s.text))) {
        locObj.steps = parsedSteps;
      }
    }

    if (Object.keys(locObj).length > 0) {
      out[locale] = locObj;
    }
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

export function sanitizeJournalTranslations(raw: unknown) {
  if (!isPlainRecord(raw)) return undefined;
  const out: Partial<
    Record<
      ContentLocale,
      {
        date?: string;
        title?: string;
        subtitle?: string;
        creditLabel?: string;
        creditValue?: string;
        secondaryLabel?: string;
        secondaryValue?: string;
        introParagraphs?: string[];
        largeHeading?: string;
        largeHeadingText?: string;
        subHeading?: string;
        subHeadingText?: string;
        details?: string[];
      }
    >
  > = {};

  for (const locale of CONTENT_LOCALES) {
    const entry = raw[locale];
    if (!isPlainRecord(entry)) continue;

    const locObj: {
      date?: string;
      title?: string;
      subtitle?: string;
      creditLabel?: string;
      creditValue?: string;
      secondaryLabel?: string;
      secondaryValue?: string;
      introParagraphs?: string[];
      largeHeading?: string;
      largeHeadingText?: string;
      subHeading?: string;
      subHeadingText?: string;
      details?: string[];
    } = {};

    const date = cleanString(entry.date, 120);
    const title = cleanString(entry.title, 200);
    const subtitle = cleanString(entry.subtitle, 500, true);
    const creditLabel = cleanString(entry.creditLabel, 80);
    const creditValue = cleanString(entry.creditValue, 160);
    const secondaryLabel = cleanString(entry.secondaryLabel, 80);
    const secondaryValue = cleanString(entry.secondaryValue, 160);
    const largeHeading = cleanString(entry.largeHeading, 180);
    const largeHeadingText = cleanString(entry.largeHeadingText, 2500, true);
    const subHeading = cleanString(entry.subHeading, 180);
    const subHeadingText = cleanString(entry.subHeadingText, 2500, true);

    if (date) locObj.date = date;
    if (title) locObj.title = title;
    if (subtitle) locObj.subtitle = subtitle;
    if (creditLabel) locObj.creditLabel = creditLabel;
    if (creditValue) locObj.creditValue = creditValue;
    if (secondaryLabel) locObj.secondaryLabel = secondaryLabel;
    if (secondaryValue) locObj.secondaryValue = secondaryValue;
    if (largeHeading) locObj.largeHeading = largeHeading;
    if (largeHeadingText) locObj.largeHeadingText = largeHeadingText;
    if (subHeading) locObj.subHeading = subHeading;
    if (subHeadingText) locObj.subHeadingText = subHeadingText;

    if (Array.isArray(entry.introParagraphs)) {
      const paragraphs = entry.introParagraphs
        .map((p) => cleanString(p, 2000, true))
        .filter(Boolean);
      if (paragraphs.length > 0) locObj.introParagraphs = paragraphs;
    }

    if (Array.isArray(entry.details)) {
      const details = entry.details
        .map((d) => cleanString(d, 1000, true))
        .filter(Boolean);
      if (details.length > 0) locObj.details = details;
    }

    if (Object.keys(locObj).length > 0) {
      out[locale] = locObj;
    }
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

