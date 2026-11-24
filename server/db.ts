import { createClient, type Client } from '@libsql/client';
import crypto from 'node:crypto';
import {
  HERO_IMAGE,
  JOURNAL_ENTRIES,
  PORTFOLIO_CATEGORIES,
  PROJECTS,
  type EnquiryItem,
  type JournalEntry,
  type PortfolioCategoryItem,
  type ProjectItem,
} from '../src/data/formtectureData.ts';

let clientInstance: Client | null = null;
let initPromise: Promise<void> | null = null;

export function isTursoCloudConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim());
}

export function isServerlessOrProd(): boolean {
  return (
    Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production'
  );
}

/**
 * In production/Vercel, persistence is ONLY active when TURSO_DATABASE_URL is configured.
 * Never writes local-studio.db onto read-only/ephemeral serverless filesystems.
 * Locally in `npm run dev`, falls back cleanly to `file:local-studio.db`.
 */
export function isPersistenceEnabled(): boolean {
  if (isTursoCloudConfigured()) return true;
  return !isServerlessOrProd();
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('Database not configured');
    this.name = 'DatabaseNotConfiguredError';
  }
}

export function getDb(): Client {
  if (!isPersistenceEnabled()) {
    throw new DatabaseNotConfiguredError();
  }
  if (clientInstance) return clientInstance;

  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (tursoUrl) {
    clientInstance = createClient({
      url: tursoUrl,
      authToken: tursoToken || undefined,
    });
  } else {
    clientInstance = createClient({
      url: 'file:local-studio.db',
    });
  }

  return clientInstance;
}

async function runSchemaAndSeed(): Promise<void> {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS portfolio_categories (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      category_line TEXT NOT NULL,
      meta_line TEXT NOT NULL,
      image TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      floor TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      year TEXT NOT NULL,
      typology TEXT NOT NULL,
      portfolio_category TEXT NOT NULL,
      category_line TEXT NOT NULL,
      medium TEXT NOT NULL,
      context TEXT NOT NULL,
      lead TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery_json TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      image TEXT NOT NULL,
      credit_label TEXT NOT NULL,
      credit_value TEXT NOT NULL,
      secondary_label TEXT NOT NULL,
      secondary_value TEXT NOT NULL,
      intro_paragraphs_json TEXT NOT NULL,
      large_heading TEXT NOT NULL,
      large_heading_text TEXT NOT NULL,
      sub_heading TEXT NOT NULL,
      sub_heading_text TEXT NOT NULL,
      details_json TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organisation TEXT NOT NULL,
      location TEXT NOT NULL,
      subject TEXT NOT NULL,
      scope TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip_hash TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      reset_at INTEGER NOT NULL
    )
  `);

  // Idempotent seed for Hero image setting
  await db.execute({
    sql: 'INSERT OR IGNORE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)',
    args: ['hero_image', HERO_IMAGE, new Date().toISOString()],
  });

  // Idempotent seed for initial Portfolio Categories (only when empty)
  const catCount = await db.execute(
    'SELECT COUNT(*) AS count FROM portfolio_categories',
  );
  if (Number(catCount.rows[0]?.count ?? 0) === 0) {
    for (let i = 0; i < PORTFOLIO_CATEGORIES.length; i += 1) {
      const cat = PORTFOLIO_CATEGORIES[i];
      await db.execute({
        sql: `INSERT OR IGNORE INTO portfolio_categories (id, code, title, category_line, meta_line, image, sort_order)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          cat.id,
          cat.code,
          cat.title,
          cat.categoryLine,
          cat.metaLine,
          cat.image,
          i,
        ],
      });
    }
  }

  // Idempotent seed for initial Projects (only when empty)
  const projCount = await db.execute('SELECT COUNT(*) AS count FROM projects');
  if (Number(projCount.rows[0]?.count ?? 0) === 0) {
    for (let i = 0; i < PROJECTS.length; i += 1) {
      const p = PROJECTS[i];
      await db.execute({
        sql: `INSERT OR IGNORE INTO projects (
                id, floor, title, location, year, typology, portfolio_category,
                category_line, medium, context, lead, image, gallery_json, steps_json,
                featured, sort_order
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          p.id,
          p.floor,
          p.title,
          p.location,
          p.year,
          p.typology,
          p.portfolioCategory,
          p.categoryLine,
          p.medium,
          p.context,
          p.lead,
          p.image,
          JSON.stringify(p.gallery),
          JSON.stringify(p.steps),
          p.featured ? 1 : 0,
          i,
        ],
      });
    }
  }

  // Idempotent seed for initial Journal Entries (only when empty)
  const journalCount = await db.execute(
    'SELECT COUNT(*) AS count FROM journal_entries',
  );
  if (Number(journalCount.rows[0]?.count ?? 0) === 0) {
    for (let i = 0; i < JOURNAL_ENTRIES.length; i += 1) {
      const j = JOURNAL_ENTRIES[i];
      await db.execute({
        sql: `INSERT OR IGNORE INTO journal_entries (
                id, date, category, title, subtitle, image,
                credit_label, credit_value, secondary_label, secondary_value,
                intro_paragraphs_json, large_heading, large_heading_text,
                sub_heading, sub_heading_text, details_json, featured, sort_order
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          j.id,
          j.date,
          j.category,
          j.title,
          j.subtitle,
          j.image,
          j.creditLabel,
          j.creditValue,
          j.secondaryLabel,
          j.secondaryValue,
          JSON.stringify(j.introParagraphs),
          j.largeHeading,
          j.largeHeadingText,
          j.subHeading,
          j.subHeadingText,
          JSON.stringify(j.details),
          j.featured ? 1 : 0,
          i,
        ],
      });
    }
  }
}

/**
 * Memoized once-per-instance database schema & seed initializer.
 * Resets memoized promise on transient error so subsequent requests can retry.
 */
export async function initDatabase(): Promise<void> {
  if (!isPersistenceEnabled()) return;
  if (!initPromise) {
    initPromise = runSchemaAndSeed().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
}

export async function getPublicPortfolio(): Promise<{
  heroImage: string;
  categories: PortfolioCategoryItem[];
  projects: ProjectItem[];
  journalEntries: JournalEntry[];
}> {
  if (!isPersistenceEnabled()) {
    return {
      heroImage: HERO_IMAGE,
      categories: PORTFOLIO_CATEGORIES,
      projects: PROJECTS,
      journalEntries: JOURNAL_ENTRIES,
    };
  }

  await initDatabase();
  const db = getDb();

  const [heroRes, catRes, projRes, journalRes] = await Promise.all([
    db.execute({
      sql: 'SELECT value FROM site_settings WHERE key = ?',
      args: ['hero_image'],
    }),
    db.execute(
      'SELECT id, code, title, category_line, meta_line, image FROM portfolio_categories ORDER BY sort_order ASC, code ASC',
    ),
    db.execute('SELECT * FROM projects ORDER BY sort_order ASC, floor ASC'),
    db.execute('SELECT * FROM journal_entries ORDER BY sort_order ASC'),
  ]);

  const heroImage =
    typeof heroRes.rows[0]?.value === 'string' && heroRes.rows[0].value
      ? heroRes.rows[0].value
      : HERO_IMAGE;

  const categories: PortfolioCategoryItem[] = catRes.rows.map((r) => ({
    id: String(r.id),
    code: String(r.code),
    title: String(r.title),
    categoryLine: String(r.category_line),
    metaLine: String(r.meta_line),
    image: String(r.image),
  }));

  const projects: ProjectItem[] = projRes.rows.map((r) => {
    let gallery: [string, string, string] = [
      String(r.image),
      String(r.image),
      String(r.image),
    ];
    try {
      const parsed = JSON.parse(String(r.gallery_json)) as string[];
      if (Array.isArray(parsed) && parsed.length >= 3) {
        gallery = [parsed[0], parsed[1], parsed[2]];
      }
    } catch {
      // fallback preserved
    }

    let steps: ProjectItem['steps'] = [
      { label: 'Material', text: '' },
      { label: 'Form', text: '' },
      { label: 'Context', text: '' },
    ];
    try {
      const parsed = JSON.parse(String(r.steps_json)) as ProjectItem['steps'];
      if (Array.isArray(parsed) && parsed.length >= 3) {
        steps = [parsed[0], parsed[1], parsed[2]];
      }
    } catch {
      // fallback preserved
    }

    return {
      id: String(r.id),
      floor: String(r.floor),
      title: String(r.title),
      location: String(r.location),
      year: String(r.year),
      typology: String(r.typology) as ProjectItem['typology'],
      portfolioCategory: String(r.portfolio_category),
      categoryLine: String(r.category_line),
      medium: String(r.medium),
      context: String(r.context),
      lead: String(r.lead),
      image: String(r.image),
      gallery,
      steps,
      featured: Boolean(Number(r.featured)),
    };
  });

  const journalEntries: JournalEntry[] = journalRes.rows.map((r) => {
    let introParagraphs: string[] = [];
    let details: string[] = [];
    try {
      introParagraphs = JSON.parse(String(r.intro_paragraphs_json)) as string[];
    } catch {
      introParagraphs = [];
    }
    try {
      details = JSON.parse(String(r.details_json)) as string[];
    } catch {
      details = [];
    }

    return {
      id: String(r.id),
      date: String(r.date),
      category: String(r.category) as JournalEntry['category'],
      title: String(r.title),
      subtitle: String(r.subtitle),
      image: String(r.image),
      creditLabel: String(r.credit_label),
      creditValue: String(r.credit_value),
      secondaryLabel: String(r.secondary_label),
      secondaryValue: String(r.secondary_value),
      introParagraphs,
      largeHeading: String(r.large_heading),
      largeHeadingText: String(r.large_heading_text),
      subHeading: String(r.sub_heading),
      subHeadingText: String(r.sub_heading_text),
      details,
      featured: Boolean(Number(r.featured)),
    };
  });

  return { heroImage, categories, projects, journalEntries };
}

export async function updateHeroImageSetting(url: string): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO site_settings (key, value, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    args: ['hero_image', url, new Date().toISOString()],
  });
}

export async function saveCategory(
  category: PortfolioCategoryItem,
  sortOrder?: number,
): Promise<void> {
  await initDatabase();
  const db = getDb();
  const existing = await db.execute({
    sql: 'SELECT sort_order FROM portfolio_categories WHERE id = ?',
    args: [category.id],
  });

  let order = sortOrder ?? 0;
  if (existing.rows.length > 0) {
    order = Number(existing.rows[0].sort_order ?? 0);
  } else if (sortOrder === undefined) {
    const maxRes = await db.execute(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM portfolio_categories',
    );
    order = Number(maxRes.rows[0]?.max_order ?? -1) + 1;
  }

  await db.execute({
    sql: `INSERT INTO portfolio_categories (id, code, title, category_line, meta_line, image, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            code = excluded.code,
            title = excluded.title,
            category_line = excluded.category_line,
            meta_line = excluded.meta_line,
            image = excluded.image`,
    args: [
      category.id,
      category.code,
      category.title,
      category.categoryLine,
      category.metaLine,
      category.image,
      order,
    ],
  });
}

export async function removeCategory(id: string): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM portfolio_categories WHERE id = ?',
    args: [id],
  });
}

export async function saveProject(project: ProjectItem): Promise<void> {
  await initDatabase();
  const db = getDb();
  const existing = await db.execute({
    sql: 'SELECT sort_order FROM projects WHERE id = ?',
    args: [project.id],
  });

  let order = 0;
  if (existing.rows.length > 0) {
    order = Number(existing.rows[0].sort_order ?? 0);
  } else {
    const maxRes = await db.execute(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM projects',
    );
    order = Number(maxRes.rows[0]?.max_order ?? -1) + 1;
  }

  await db.execute({
    sql: `INSERT INTO projects (
            id, floor, title, location, year, typology, portfolio_category,
            category_line, medium, context, lead, image, gallery_json, steps_json,
            featured, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            floor = excluded.floor,
            title = excluded.title,
            location = excluded.location,
            year = excluded.year,
            typology = excluded.typology,
            portfolio_category = excluded.portfolio_category,
            category_line = excluded.category_line,
            medium = excluded.medium,
            context = excluded.context,
            lead = excluded.lead,
            image = excluded.image,
            gallery_json = excluded.gallery_json,
            steps_json = excluded.steps_json,
            featured = excluded.featured`,
    args: [
      project.id,
      project.floor,
      project.title,
      project.location,
      project.year,
      project.typology,
      project.portfolioCategory,
      project.categoryLine,
      project.medium,
      project.context,
      project.lead,
      project.image,
      JSON.stringify(project.gallery),
      JSON.stringify(project.steps),
      project.featured ? 1 : 0,
      order,
    ],
  });
}

export async function removeProject(id: string): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM projects WHERE id = ?',
    args: [id],
  });
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  await initDatabase();
  const db = getDb();
  const existing = await db.execute({
    sql: 'SELECT sort_order FROM journal_entries WHERE id = ?',
    args: [entry.id],
  });

  let order = 0;
  if (existing.rows.length > 0) {
    order = Number(existing.rows[0].sort_order ?? 0);
  } else {
    const maxRes = await db.execute(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM journal_entries',
    );
    order = Number(maxRes.rows[0]?.max_order ?? -1) + 1;
  }

  await db.execute({
    sql: `INSERT INTO journal_entries (
            id, date, category, title, subtitle, image,
            credit_label, credit_value, secondary_label, secondary_value,
            intro_paragraphs_json, large_heading, large_heading_text,
            sub_heading, sub_heading_text, details_json, featured, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            date = excluded.date,
            category = excluded.category,
            title = excluded.title,
            subtitle = excluded.subtitle,
            image = excluded.image,
            credit_label = excluded.credit_label,
            credit_value = excluded.credit_value,
            secondary_label = excluded.secondary_label,
            secondary_value = excluded.secondary_value,
            intro_paragraphs_json = excluded.intro_paragraphs_json,
            large_heading = excluded.large_heading,
            large_heading_text = excluded.large_heading_text,
            sub_heading = excluded.sub_heading,
            sub_heading_text = excluded.sub_heading_text,
            details_json = excluded.details_json,
            featured = excluded.featured`,
    args: [
      entry.id,
      entry.date,
      entry.category,
      entry.title,
      entry.subtitle,
      entry.image,
      entry.creditLabel,
      entry.creditValue,
      entry.secondaryLabel,
      entry.secondaryValue,
      JSON.stringify(entry.introParagraphs),
      entry.largeHeading,
      entry.largeHeadingText,
      entry.subHeading,
      entry.subHeadingText,
      JSON.stringify(entry.details),
      entry.featured ? 1 : 0,
      order,
    ],
  });
}

export async function removeJournalEntry(id: string): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM journal_entries WHERE id = ?',
    args: [id],
  });
}

export async function insertEnquiry(data: {
  name: string;
  email: string;
  organisation: string;
  location: string;
  subject: string;
  scope: string;
  message: string;
}): Promise<EnquiryItem> {
  await initDatabase();
  const db = getDb();
  const record: EnquiryItem = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    organisation: data.organisation,
    location: data.location,
    subject: data.subject,
    scope: data.scope,
    message: data.message,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  await db.execute({
    sql: `INSERT INTO enquiries (id, name, email, organisation, location, subject, scope, message, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      record.id,
      record.name,
      record.email,
      record.organisation,
      record.location,
      record.subject,
      record.scope,
      record.message,
      record.status,
      record.createdAt,
    ],
  });

  return record;
}

export async function listEnquiries(): Promise<EnquiryItem[]> {
  await initDatabase();
  const db = getDb();
  const res = await db.execute(
    'SELECT * FROM enquiries ORDER BY created_at DESC',
  );
  return res.rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    organisation: String(r.organisation),
    location: String(r.location),
    subject: String(r.subject),
    scope: String(r.scope),
    message: String(r.message),
    status: String(r.status) as EnquiryItem['status'],
    createdAt: String(r.created_at),
  }));
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryItem['status'],
): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'UPDATE enquiries SET status = ? WHERE id = ?',
    args: [status, id],
  });
}

export async function removeEnquiry(id: string): Promise<void> {
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM enquiries WHERE id = ?',
    args: [id],
  });
}

export async function getAdminCredentialHash(): Promise<string | null> {
  if (!isPersistenceEnabled()) return null;
  await initDatabase();
  const db = getDb();
  const res = await db.execute(
    'SELECT password_hash FROM admin_credentials WHERE id = 1',
  );
  if (res.rows.length === 0) return null;
  return String(res.rows[0].password_hash);
}

export async function claimInitialAdminHash(hash: string): Promise<boolean> {
  await initDatabase();
  const db = getDb();
  try {
    await db.execute({
      sql: 'INSERT INTO admin_credentials (id, password_hash, created_at) VALUES (1, ?, ?)',
      args: [hash, new Date().toISOString()],
    });
    return true;
  } catch {
    return false;
  }
}

export async function getDbLoginAttempt(
  ipHash: string,
): Promise<{ attempts: number; resetAt: number } | null> {
  if (!isPersistenceEnabled()) return null;
  await initDatabase();
  const db = getDb();
  const res = await db.execute({
    sql: 'SELECT attempts, reset_at FROM login_attempts WHERE ip_hash = ?',
    args: [ipHash],
  });
  if (res.rows.length === 0) return null;
  return {
    attempts: Number(res.rows[0].attempts ?? 0),
    resetAt: Number(res.rows[0].reset_at ?? 0),
  };
}

export async function saveDbLoginAttempt(
  ipHash: string,
  attempts: number,
  resetAt: number,
): Promise<void> {
  if (!isPersistenceEnabled()) return;
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO login_attempts (ip_hash, attempts, reset_at)
          VALUES (?, ?, ?)
          ON CONFLICT(ip_hash) DO UPDATE SET attempts = excluded.attempts, reset_at = excluded.reset_at`,
    args: [ipHash, attempts, resetAt],
  });
}

export async function clearDbLoginAttempt(ipHash: string): Promise<void> {
  if (!isPersistenceEnabled()) return;
  await initDatabase();
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM login_attempts WHERE ip_hash = ?',
    args: [ipHash],
  });
}
