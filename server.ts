import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
  createAdminToken,
  getAdminAuthState,
  hashPassword,
  isEnvPasscodeConfigured,
  recordFailedLoginAttempt,
  requireAdmin,
  verifyEnvPasscode,
  verifyPasswordHash,
  verifySameOrigin,
} from './server/auth.ts';
import {
  createSignedCloudinaryUpload,
  isCloudinaryConfigured,
  isTrustedCloudinaryUrl,
  uploadBufferToCloudinary,
} from './server/cloudinary.ts';
import {
  categoryExists,
  claimInitialAdminHash,
  DatabaseNotConfiguredError,
  getAdminCredentialHash,
  getPublicPortfolio,
  initDatabase,
  insertEnquiry,
  isPersistenceEnabled,
  isServerlessOrProd,
  isTursoCloudConfigured,
  journalEntryExists,
  listEnquiries,
  projectExists,
  removeCategory,
  removeEnquiry,
  removeJournalEntry,
  removeProject,
  saveCategory,
  saveJournalEntry,
  saveProject,
  syncAllToDatabase,
  updateEnquiryStatus,
  updateHeroImageSetting,
  updateSiteImageSetting,
} from './server/db.ts';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
  injectHtmlSeoMeta,
  resolveBaseUrl,
} from './server/seo.ts';
import {
  ALLOWED_ENQUIRY_STATUSES,
  ALLOWED_JOURNAL_CATEGORIES,
  ALLOWED_TYPOLOGIES,
  cleanString,
  isBuiltInAssetPath,
  isSafeAssetUrl,
  isValidEmail,
  normalizeAdminPath,
  normalizeCategoryId,
  slugifyLower,
} from './server/validators.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_VERSION = process.env.npm_package_version || '1.0.0';
const isProd = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);
const ADMIN_PATH = normalizeAdminPath(
  process.env.ADMIN_PATH || process.env.VITE_ADMIN_PATH,
);

function isAdminPathRequest(reqPath: string): boolean {
  const normalized = reqPath.replace(/\/+$/, '') || '/';
  return normalized === ADMIN_PATH || normalized.startsWith(`${ADMIN_PATH}/`);
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Baseline security headers for Express responses
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Never cache API responses
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  next();
});

// Strict no-store, noindex, and same-origin guard on all admin API routes
app.use('/api/admin', (req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private',
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (
    req.method !== 'GET' &&
    req.method !== 'HEAD' &&
    req.method !== 'OPTIONS'
  ) {
    verifySameOrigin(req, res, next);
    return;
  }
  next();
});

// Block legacy predictable /admin route completely
app.all(['/admin', '/admin/*'], (_req, res) => {
  res.status(404).type('text/plain').send('Not found');
});

app.use(express.json({ limit: '1mb' }));

function handleRouteError(
  res: Response,
  err: unknown,
  fallbackMessage: string,
): void {
  if (err instanceof DatabaseNotConfiguredError) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  res.status(500).json({ error: fallbackMessage });
}

function ensureDatabaseAvailable(res: Response): boolean {
  if (!isPersistenceEnabled()) {
    res.status(503).json({ error: 'Database not configured' });
    return false;
  }
  return true;
}

// --- Health Check ---

app.get('/api/health', async (_req, res) => {
  try {
    const authState = await getAdminAuthState();
    res.json({
      ok: true,
      version: APP_VERSION,
      environment:
        process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      turso: isTursoCloudConfigured() ? 'configured' : 'missing',
      cloudinary: isCloudinaryConfigured() ? 'configured' : 'missing',
      adminAuth: authState.adminEnabled ? 'configured' : 'missing',
    });
  } catch {
    res.status(500).json({ ok: false, error: 'Health check failed.' });
  }
});

// --- Public API Routes ---

app.get('/api/portfolio', async (_req, res) => {
  try {
    const data = await getPublicPortfolio();
    res.json(data);
  } catch (err) {
    handleRouteError(res, err, 'Unable to load portfolio archive.');
  }
});

app.post('/api/enquiries', async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;

  try {
    const name = cleanString(req.body?.name, 120);
    const email = cleanString(req.body?.email, 254);
    const organisation = cleanString(req.body?.organisation, 160);
    const location = cleanString(req.body?.location, 120);
    const subject = cleanString(req.body?.subject, 120) || 'General Enquiry';
    const scope = cleanString(req.body?.scope, 120);
    const message = cleanString(req.body?.message, 4000, true);

    if (!name || !isValidEmail(email) || !message) {
      res.status(400).json({
        error: 'Please provide your name, a valid email address, and a message.',
      });
      return;
    }

    const record = await insertEnquiry({
      name,
      email,
      organisation,
      location,
      subject,
      scope,
      message,
    });

    res.status(201).json({ ok: true, id: record.id });
  } catch (err) {
    handleRouteError(res, err, 'Unable to submit enquiry.');
  }
});

// --- Admin Auth Routes ---

app.get('/api/admin/auth/status', async (_req, res) => {
  try {
    const authState = await getAdminAuthState();
    res.json({
      adminEnabled: authState.adminEnabled,
      disabledReason: authState.disabledReason,
      needsSetup: authState.needsSetup,
    });
  } catch {
    res.status(500).json({ error: 'Unable to inspect admin status.' });
  }
});

app.post('/api/admin/auth/setup', async (req, res) => {
  try {
    const rate = await checkLoginRateLimit(req);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      res.status(429).json({
        error: 'Too many requests. Please wait before trying again.',
      });
      return;
    }

    if (isServerlessOrProd() || isEnvPasscodeConfigured()) {
      await recordFailedLoginAttempt(req);
      res.status(403).json({
        error: 'Initial admin setup is disabled in this environment.',
      });
      return;
    }

    if (!ensureDatabaseAvailable(res)) return;

    const existingHash = await getAdminCredentialHash();
    if (existingHash !== null) {
      res.status(409).json({
        error: 'Admin password has already been initialized.',
      });
      return;
    }

    const password =
      typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({
        error: 'Password must be between 8 and 128 characters.',
      });
      return;
    }

    const hash = hashPassword(password);
    const claimed = await claimInitialAdminHash(hash);
    if (!claimed) {
      res.status(409).json({
        error: 'Admin password has already been initialized.',
      });
      return;
    }

    await clearLoginRateLimit(req);
    const token = await createAdminToken();
    res.status(201).json({ token });
  } catch (err) {
    handleRouteError(res, err, 'Unable to initialize admin credentials.');
  }
});

app.post('/api/admin/auth/login', async (req, res) => {
  try {
    const authState = await getAdminAuthState();
    if (!authState.adminEnabled) {
      res.status(503).json({
        error:
          authState.disabledReason ||
          'Admin login is disabled in this environment.',
      });
      return;
    }

    const rate = await checkLoginRateLimit(req);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      res.status(429).json({
        error: 'Too many failed login attempts. Please wait before trying again.',
      });
      return;
    }

    const password =
      typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (!password) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    let valid = false;
    if (password.length <= 256) {
      if (isEnvPasscodeConfigured()) {
        valid = verifyEnvPasscode(password);
      } else if (isPersistenceEnabled()) {
        const storedHash = await getAdminCredentialHash();
        valid = Boolean(storedHash && verifyPasswordHash(password, storedHash));
      }
    }

    if (!valid) {
      await recordFailedLoginAttempt(req);
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    await clearLoginRateLimit(req);
    const token = await createAdminToken();
    res.json({ token });
  } catch (err) {
    handleRouteError(res, err, 'Unable to sign in.');
  }
});

// --- Protected Admin Routes ---

function collectPortfolioImageUrls(
  portfolio: Awaited<ReturnType<typeof getPublicPortfolio>>,
): string[] {
  const urls = new Set<string>();
  if (portfolio.heroImage) urls.add(portfolio.heroImage);
  if (portfolio.practiceImage) urls.add(portfolio.practiceImage);
  if (portfolio.modelImage) urls.add(portfolio.modelImage);
  for (const cat of portfolio.categories) {
    if (cat.image) urls.add(cat.image);
  }
  for (const proj of portfolio.projects) {
    if (proj.image) urls.add(proj.image);
    for (const g of proj.gallery) {
      if (g) urls.add(g);
    }
  }
  for (const entry of portfolio.journalEntries) {
    if (entry.image) urls.add(entry.image);
  }
  return Array.from(urls);
}

function computeCloudSyncStats(
  portfolio: Awaited<ReturnType<typeof getPublicPortfolio>>,
) {
  const allUrls = collectPortfolioImageUrls(portfolio);
  const cloudinaryConfigured = isCloudinaryConfigured();
  const tursoCloud = isTursoCloudConfigured();
  const cloudinaryImages = cloudinaryConfigured
    ? allUrls.filter((u) => isTrustedCloudinaryUrl(u)).length
    : 0;
  const totalImages = allUrls.length;
  const remainingLocalAssets = totalImages - cloudinaryImages;
  const syncedPercent =
    totalImages === 0
      ? 100
      : Math.round((cloudinaryImages / totalImages) * 100);

  return {
    totalImages,
    cloudinaryImages,
    remainingLocalAssets,
    syncedPercent,
    readyToMigrate: tursoCloud && cloudinaryConfigured,
    fullySynchronized:
      tursoCloud && cloudinaryConfigured && remainingLocalAssets === 0,
  };
}

function resolveSelfOrigin(req: Request): string {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto =
    typeof forwardedProto === 'string' && forwardedProto === 'https'
      ? 'https'
      : req.protocol === 'https'
        ? 'https'
        : 'http';

  const rawHost =
    (typeof req.headers['x-forwarded-host'] === 'string'
      ? req.headers['x-forwarded-host']
      : req.headers.host) || '';

  if (/^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(rawHost)) {
    return `${proto}://${rawHost}`;
  }
  return resolveBaseUrl(req);
}

async function loadBuiltInAssetBuffer(
  assetPath: string,
  selfOrigin: string,
): Promise<Buffer> {
  if (!isBuiltInAssetPath(assetPath)) {
    throw new Error(`Unsupported local asset path: ${assetPath}`);
  }

  const candidateRoots: Array<{ prefix: string; baseDir: string }> = [
    { prefix: '/assets/', baseDir: path.resolve(process.cwd(), 'public', 'assets') },
    { prefix: '/assets/', baseDir: path.resolve(process.cwd(), 'dist', 'assets') },
    { prefix: '/src/assets/', baseDir: path.resolve(process.cwd(), 'src', 'assets') },
    { prefix: '/src/assets/', baseDir: path.resolve(process.cwd(), 'dist', 'src', 'assets') },
  ];

  for (const { prefix, baseDir } of candidateRoots) {
    if (!assetPath.startsWith(prefix)) continue;
    const rel = assetPath.slice(prefix.length);
    const resolved = path.resolve(baseDir, rel);
    if (!resolved.startsWith(baseDir + path.sep)) continue;
    try {
      return await fs.readFile(resolved);
    } catch {
      // Try next filesystem candidate or CDN fallback below
    }
  }

  // On Vercel serverless, static files are served by CDN on the deployment host
  const fetchRes = await fetch(`${selfOrigin}${assetPath}`);
  if (!fetchRes.ok) {
    throw new Error(`Failed to fetch built-in asset: ${assetPath}`);
  }
  const contentType = fetchRes.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unexpected asset content type for: ${assetPath}`);
  }
  const arr = await fetchRes.arrayBuffer();
  if (arr.byteLength > 10 * 1024 * 1024) {
    throw new Error(`Asset exceeds max migration size: ${assetPath}`);
  }
  return Buffer.from(arr);
}

app.get('/api/admin/status', requireAdmin, async (_req, res) => {
  try {
    const portfolio = await getPublicPortfolio();
    const enquiries = isPersistenceEnabled() ? await listEnquiries() : [];
    res.json({
      tursoCloud: isTursoCloudConfigured(),
      persistenceEnabled: isPersistenceEnabled(),
      cloudinaryConfigured: isCloudinaryConfigured(),
      sync: computeCloudSyncStats(portfolio),
      counts: {
        siteImages: 3,
        categories: portfolio.categories.length,
        projects: portfolio.projects.length,
        journal: portfolio.journalEntries.length,
        enquiriesNew: enquiries.filter((e) => e.status === 'NEW').length,
        enquiriesTotal: enquiries.length,
      },
    });
  } catch (err) {
    handleRouteError(res, err, 'Unable to load admin status.');
  }
});

// Full 100% Migration & Sync to Cloudinary + Turso Cloud
app.post('/api/admin/migrate', requireAdmin, async (req, res) => {
  if (!isTursoCloudConfigured() || !isCloudinaryConfigured()) {
    res.status(503).json({
      error:
        'Migration is disabled until both Turso Cloud and Cloudinary are connected.',
    });
    return;
  }

  try {
    await initDatabase();
    const current = await getPublicPortfolio();
    const selfOrigin = resolveSelfOrigin(req);
    const allUrls = collectPortfolioImageUrls(current);
    const urlMap = new Map<string, string>();
    const pendingBuiltIn: string[] = [];

    for (const url of allUrls) {
      if (isTrustedCloudinaryUrl(url)) {
        urlMap.set(url, url);
      } else if (isBuiltInAssetPath(url)) {
        pendingBuiltIn.push(url);
      }
    }

    // Upload unique built-in assets in bounded batches of 4
    let imagesUploaded = 0;
    const BATCH_SIZE = 4;
    for (let i = 0; i < pendingBuiltIn.length; i += BATCH_SIZE) {
      const batch = pendingBuiltIn.slice(i, i + BATCH_SIZE);
      const uploadedBatch = await Promise.all(
        batch.map(async (assetPath) => {
          const buffer = await loadBuiltInAssetBuffer(assetPath, selfOrigin);
          const fileBase = path.basename(assetPath, path.extname(assetPath));
          const secureUrl = await uploadBufferToCloudinary(buffer, fileBase);
          return { assetPath, secureUrl };
        }),
      );
      for (const item of uploadedBatch) {
        urlMap.set(item.assetPath, item.secureUrl);
        imagesUploaded += 1;
      }
    }

    const resolveMigrated = (raw: string): string => urlMap.get(raw) ?? raw;

    const updatedPayload = {
      heroImage: resolveMigrated(current.heroImage),
      practiceImage: resolveMigrated(current.practiceImage),
      modelImage: resolveMigrated(current.modelImage),
      categories: current.categories.map((cat) => ({
        ...cat,
        image: resolveMigrated(cat.image),
      })),
      projects: current.projects.map((proj) => ({
        ...proj,
        image: resolveMigrated(proj.image),
        gallery: [
          resolveMigrated(proj.gallery[0]),
          resolveMigrated(proj.gallery[1]),
          resolveMigrated(proj.gallery[2]),
        ] as [string, string, string],
      })),
      journalEntries: current.journalEntries.map((entry) => ({
        ...entry,
        image: resolveMigrated(entry.image),
      })),
    };

    await syncAllToDatabase(updatedPayload);

    const verified = await getPublicPortfolio();
    const sync = computeCloudSyncStats(verified);

    res.json({
      ok: true,
      imagesUploaded,
      sync,
      counts: {
        siteImages: 3,
        categories: verified.categories.length,
        projects: verified.projects.length,
        journal: verified.journalEntries.length,
      },
    });
  } catch (err) {
    handleRouteError(res, err, 'Cloud migration failed. Please try again.');
  }
});

// Direct Signed Cloudinary Upload (no disk writes, avoids Vercel 4.5MB body ceiling)
app.post('/api/admin/upload/sign', requireAdmin, (_req, res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503).json({ error: 'Cloudinary is not configured.' });
    return;
  }

  try {
    const signed = createSignedCloudinaryUpload();
    res.json(signed);
  } catch {
    res.status(503).json({ error: 'Cloudinary is not configured.' });
  }
});

app.post('/api/admin/upload/verify', requireAdmin, (req, res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503).json({ error: 'Cloudinary is not configured.' });
    return;
  }

  const rawUrl = cleanString(req.body?.url, 1200);
  if (!isTrustedCloudinaryUrl(rawUrl)) {
    res.status(400).json({
      error: 'Uploaded URL does not match the configured Cloudinary cloud.',
    });
    return;
  }

  res.json({
    ok: true,
    url: rawUrl,
    storage: 'cloudinary' as const,
  });
});

app.put('/api/admin/hero', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const heroImage = cleanString(req.body?.heroImage, 1200);
    const practiceImage = cleanString(req.body?.practiceImage, 1200);
    const modelImage = cleanString(req.body?.modelImage, 1200);

    if (!isSafeAssetUrl(heroImage)) {
      res.status(400).json({ error: 'Please provide a valid Hero image URL.' });
      return;
    }
    if (practiceImage && !isSafeAssetUrl(practiceImage)) {
      res
        .status(400)
        .json({ error: 'Please provide a valid Practice image URL.' });
      return;
    }
    if (modelImage && !isSafeAssetUrl(modelImage)) {
      res
        .status(400)
        .json({ error: 'Please provide a valid Studio image URL.' });
      return;
    }

    await updateHeroImageSetting(heroImage);
    if (practiceImage) {
      await updateSiteImageSetting('practice_image', practiceImage);
    }
    if (modelImage) {
      await updateSiteImageSetting('model_image', modelImage);
    }
    res.json({
      ok: true,
      heroImage,
      ...(practiceImage ? { practiceImage } : {}),
      ...(modelImage ? { modelImage } : {}),
    });
  } catch (err) {
    handleRouteError(res, err, 'Unable to update Hero image.');
  }
});

// Categories CRUD
app.post('/api/admin/categories', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const title = cleanString(req.body?.title, 80);
    const id =
      normalizeCategoryId(cleanString(req.body?.id || title, 48)) || '';
    const code = cleanString(req.body?.code, 16) || '05';
    const categoryLine = cleanString(req.body?.categoryLine, 160);
    const metaLine = cleanString(req.body?.metaLine, 160);
    const image = cleanString(req.body?.image, 1200);

    if (!id || !title || !categoryLine || !isSafeAssetUrl(image)) {
      res.status(400).json({
        error: 'Category title, subtitle, and valid image URL are required.',
      });
      return;
    }

    if (await categoryExists(id)) {
      res.status(409).json({
        error: `Category "${id}" already exists. Edit the existing category or choose a different key.`,
      });
      return;
    }

    const item = { id, code, title, categoryLine, metaLine, image };
    await saveCategory(item);
    res.status(201).json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to save category.');
  }
});

function resolveCategoryIdFromRequest(req: Request): string {
  const fromQuery =
    typeof req.query.id === 'string' ? cleanString(req.query.id, 48) : '';
  if (fromQuery) return fromQuery;

  const fromWildcard =
    typeof req.params[0] === 'string' ? cleanString(req.params[0], 48) : '';
  if (fromWildcard) return fromWildcard;

  const fromParam =
    typeof req.params.id === 'string' ? cleanString(req.params.id, 48) : '';
  if (fromParam) return fromParam;

  return cleanString(req.body?.id, 48);
}

async function handleUpdateCategory(req: Request, res: Response) {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = resolveCategoryIdFromRequest(req);
    const title = cleanString(req.body?.title, 80);
    const code = cleanString(req.body?.code, 16);
    const categoryLine = cleanString(req.body?.categoryLine, 160);
    const metaLine = cleanString(req.body?.metaLine, 160);
    const image = cleanString(req.body?.image, 1200);

    if (!id || !title || !code || !categoryLine || !isSafeAssetUrl(image)) {
      res.status(400).json({ error: 'Invalid category payload.' });
      return;
    }

    if (!(await categoryExists(id))) {
      res.status(404).json({ error: 'Category not found in database.' });
      return;
    }

    const item = { id, code, title, categoryLine, metaLine, image };
    await saveCategory(item);
    res.json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to update category.');
  }
}

async function handleDeleteCategoryRoute(req: Request, res: Response) {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = resolveCategoryIdFromRequest(req);
    if (!id) {
      res.status(400).json({ error: 'Category id is required.' });
      return;
    }
    const deleted = await removeCategory(id);
    if (!deleted) {
      res.status(404).json({ error: 'Category not found in database.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    handleRouteError(res, err, 'Unable to delete category.');
  }
}

app.put('/api/admin/categories', requireAdmin, handleUpdateCategory);
app.put('/api/admin/categories/*', requireAdmin, handleUpdateCategory);
app.delete('/api/admin/categories', requireAdmin, handleDeleteCategoryRoute);
app.delete('/api/admin/categories/*', requireAdmin, handleDeleteCategoryRoute);

// Projects / Artworks CRUD
async function resolveUniqueId(
  baseId: string,
  existsFn: (candidate: string) => Promise<boolean>,
): Promise<string> {
  let candidate = baseId;
  let counter = 2;
  while (await existsFn(candidate)) {
    const suffix = `-${counter}`;
    candidate = `${baseId.slice(0, Math.max(1, 64 - suffix.length))}${suffix}`;
    counter += 1;
  }
  return candidate;
}

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const title = cleanString(req.body?.title, 160);
    const rawSlug = slugifyLower(cleanString(req.body?.id || title, 64));
    const floor = cleanString(req.body?.floor, 16) || '18';
    const location = cleanString(req.body?.location, 120) || 'PORTUGAL';
    const year = cleanString(req.body?.year, 32) || '2025';
    const typologyRaw = cleanString(req.body?.typology, 32);
    const typology = ALLOWED_TYPOLOGIES.includes(
      typologyRaw as (typeof ALLOWED_TYPOLOGIES)[number],
    )
      ? (typologyRaw as (typeof ALLOWED_TYPOLOGIES)[number])
      : 'SCULPTURE';
    const portfolioCategory =
      cleanString(req.body?.portfolioCategory, 48) || 'STONE';
    const categoryLine =
      cleanString(req.body?.categoryLine, 160) ||
      `${typology} · ${portfolioCategory}`;
    const medium = cleanString(req.body?.medium, 160) || typology;
    const context = cleanString(req.body?.context, 160) || `${location} · ${year}`;
    const lead = cleanString(req.body?.lead, 600, true);
    const image = cleanString(req.body?.image, 1200);

    if (!rawSlug || !title || !lead || !isSafeAssetUrl(image)) {
      res.status(400).json({
        error: 'Work title, description, and a valid primary image URL are required.',
      });
      return;
    }

    const id = await resolveUniqueId(rawSlug, projectExists);

    const rawGallery = Array.isArray(req.body?.gallery)
      ? req.body.gallery
      : [image, image, image];
    const gallery: [string, string, string] = [
      isSafeAssetUrl(rawGallery[0]) ? cleanString(rawGallery[0], 1200) : image,
      isSafeAssetUrl(rawGallery[1]) ? cleanString(rawGallery[1], 1200) : image,
      isSafeAssetUrl(rawGallery[2]) ? cleanString(rawGallery[2], 1200) : image,
    ];

    const rawSteps = Array.isArray(req.body?.steps) ? req.body.steps : [];
    const steps: [
      { label: string; text: string },
      { label: string; text: string },
      { label: string; text: string },
    ] = [
      {
        label: cleanString(rawSteps[0]?.label, 60) || 'Material',
        text: cleanString(rawSteps[0]?.text, 600, true) || lead,
      },
      {
        label: cleanString(rawSteps[1]?.label, 60) || 'Form',
        text: cleanString(rawSteps[1]?.text, 600, true) || lead,
      },
      {
        label: cleanString(rawSteps[2]?.label, 60) || 'Context',
        text: cleanString(rawSteps[2]?.text, 600, true) || context,
      },
    ];

    const item = {
      id,
      floor,
      title,
      location,
      year,
      typology,
      portfolioCategory,
      categoryLine,
      medium,
      context,
      lead,
      image,
      gallery,
      steps,
      featured: Boolean(req.body?.featured),
    };

    await saveProject(item);
    res.status(201).json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to save work.');
  }
});

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    const title = cleanString(req.body?.title, 160);
    const floor = cleanString(req.body?.floor, 16);
    const location = cleanString(req.body?.location, 120);
    const year = cleanString(req.body?.year, 32);
    const typologyRaw = cleanString(req.body?.typology, 32);
    const typology = ALLOWED_TYPOLOGIES.includes(
      typologyRaw as (typeof ALLOWED_TYPOLOGIES)[number],
    )
      ? (typologyRaw as (typeof ALLOWED_TYPOLOGIES)[number])
      : 'SCULPTURE';
    const portfolioCategory = cleanString(req.body?.portfolioCategory, 48);
    const categoryLine = cleanString(req.body?.categoryLine, 160);
    const medium = cleanString(req.body?.medium, 160);
    const context = cleanString(req.body?.context, 160);
    const lead = cleanString(req.body?.lead, 600, true);
    const image = cleanString(req.body?.image, 1200);

    if (!id || !title || !lead || !isSafeAssetUrl(image)) {
      res.status(400).json({ error: 'Invalid work payload.' });
      return;
    }

    if (!(await projectExists(id))) {
      res.status(404).json({ error: 'Work not found in database.' });
      return;
    }

    const rawGallery = Array.isArray(req.body?.gallery)
      ? req.body.gallery
      : [image, image, image];
    const gallery: [string, string, string] = [
      isSafeAssetUrl(rawGallery[0]) ? cleanString(rawGallery[0], 1200) : image,
      isSafeAssetUrl(rawGallery[1]) ? cleanString(rawGallery[1], 1200) : image,
      isSafeAssetUrl(rawGallery[2]) ? cleanString(rawGallery[2], 1200) : image,
    ];

    const rawSteps = Array.isArray(req.body?.steps) ? req.body.steps : [];
    const steps: [
      { label: string; text: string },
      { label: string; text: string },
      { label: string; text: string },
    ] = [
      {
        label: cleanString(rawSteps[0]?.label, 60) || 'Material',
        text: cleanString(rawSteps[0]?.text, 600, true) || lead,
      },
      {
        label: cleanString(rawSteps[1]?.label, 60) || 'Form',
        text: cleanString(rawSteps[1]?.text, 600, true) || lead,
      },
      {
        label: cleanString(rawSteps[2]?.label, 60) || 'Context',
        text: cleanString(rawSteps[2]?.text, 600, true) || context,
      },
    ];

    const item = {
      id,
      floor: floor || '01',
      title,
      location: location || 'PORTUGAL',
      year: year || '2025',
      typology,
      portfolioCategory: portfolioCategory || 'STONE',
      categoryLine: categoryLine || `${typology} · ${portfolioCategory}`,
      medium: medium || typology,
      context: context || location,
      lead,
      image,
      gallery,
      steps,
      featured: Boolean(req.body?.featured),
    };

    await saveProject(item);
    res.json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to update work.');
  }
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    if (!id) {
      res.status(400).json({ error: 'Work id is required.' });
      return;
    }
    const deleted = await removeProject(id);
    if (!deleted) {
      res.status(404).json({ error: 'Work not found in database.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    handleRouteError(res, err, 'Unable to delete work.');
  }
});

// Journal / Exhibitions CRUD
app.post('/api/admin/journal', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const title = cleanString(req.body?.title, 200);
    const rawSlug = slugifyLower(cleanString(req.body?.id || title, 64));
    const date = cleanString(req.body?.date, 120) || 'EXHIBITION';
    const categoryRaw = cleanString(req.body?.category, 32);
    const category = ALLOWED_JOURNAL_CATEGORIES.includes(
      categoryRaw as (typeof ALLOWED_JOURNAL_CATEGORIES)[number],
    )
      ? (categoryRaw as (typeof ALLOWED_JOURNAL_CATEGORIES)[number])
      : 'EXHIBITION';
    const subtitle = cleanString(req.body?.subtitle, 500, true);
    const image = cleanString(req.body?.image, 1200);
    const creditLabel = cleanString(req.body?.creditLabel, 80) || 'CURATED BY';
    const creditValue = cleanString(req.body?.creditValue, 160) || 'ZET GALLERY';
    const secondaryLabel = cleanString(req.body?.secondaryLabel, 80) || 'VENUE';
    const secondaryValue =
      cleanString(req.body?.secondaryValue, 160) || date;
    const introParagraphs = Array.isArray(req.body?.introParagraphs)
      ? (req.body.introParagraphs as unknown[])
          .map((p) => cleanString(p, 2000, true))
          .filter(Boolean)
      : [subtitle];
    const largeHeading = cleanString(req.body?.largeHeading, 180) || title;
    const largeHeadingText =
      cleanString(req.body?.largeHeadingText, 2500, true) || subtitle;
    const subHeading = cleanString(req.body?.subHeading, 180) || 'Practice & Space';
    const subHeadingText =
      cleanString(req.body?.subHeadingText, 2500, true) || subtitle;
    const details = Array.isArray(req.body?.details)
      ? (req.body.details as unknown[])
          .map((d) => cleanString(d, 1000, true))
          .filter(Boolean)
      : [subtitle];

    if (!rawSlug || !title || !subtitle || !isSafeAssetUrl(image)) {
      res.status(400).json({
        error: 'Entry title, subtitle, and a valid cover image URL are required.',
      });
      return;
    }

    const id = await resolveUniqueId(rawSlug, journalEntryExists);

    const item = {
      id,
      date,
      category,
      title,
      subtitle,
      image,
      creditLabel,
      creditValue,
      secondaryLabel,
      secondaryValue,
      introParagraphs: introParagraphs.length > 0 ? introParagraphs : [subtitle],
      largeHeading,
      largeHeadingText,
      subHeading,
      subHeadingText,
      details: details.length > 0 ? details : [subtitle],
      featured: req.body?.featured !== undefined ? Boolean(req.body.featured) : true,
    };

    await saveJournalEntry(item);
    res.status(201).json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to save journal entry.');
  }
});

app.put('/api/admin/journal/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    const title = cleanString(req.body?.title, 200);
    const date = cleanString(req.body?.date, 120) || 'EXHIBITION';
    const categoryRaw = cleanString(req.body?.category, 32);
    const category = ALLOWED_JOURNAL_CATEGORIES.includes(
      categoryRaw as (typeof ALLOWED_JOURNAL_CATEGORIES)[number],
    )
      ? (categoryRaw as (typeof ALLOWED_JOURNAL_CATEGORIES)[number])
      : 'EXHIBITION';
    const subtitle = cleanString(req.body?.subtitle, 500, true);
    const image = cleanString(req.body?.image, 1200);
    const creditLabel = cleanString(req.body?.creditLabel, 80) || 'CURATED BY';
    const creditValue = cleanString(req.body?.creditValue, 160) || 'ZET GALLERY';
    const secondaryLabel = cleanString(req.body?.secondaryLabel, 80) || 'VENUE';
    const secondaryValue =
      cleanString(req.body?.secondaryValue, 160) || date;
    const introParagraphs = Array.isArray(req.body?.introParagraphs)
      ? (req.body.introParagraphs as unknown[])
          .map((p) => cleanString(p, 2000, true))
          .filter(Boolean)
      : [subtitle];
    const largeHeading = cleanString(req.body?.largeHeading, 180) || title;
    const largeHeadingText =
      cleanString(req.body?.largeHeadingText, 2500, true) || subtitle;
    const subHeading = cleanString(req.body?.subHeading, 180) || 'Practice & Space';
    const subHeadingText =
      cleanString(req.body?.subHeadingText, 2500, true) || subtitle;
    const details = Array.isArray(req.body?.details)
      ? (req.body.details as unknown[])
          .map((d) => cleanString(d, 1000, true))
          .filter(Boolean)
      : [subtitle];

    if (!id || !title || !subtitle || !isSafeAssetUrl(image)) {
      res.status(400).json({ error: 'Invalid journal entry payload.' });
      return;
    }

    if (!(await journalEntryExists(id))) {
      res.status(404).json({ error: 'Journal entry not found in database.' });
      return;
    }

    const item = {
      id,
      date,
      category,
      title,
      subtitle,
      image,
      creditLabel,
      creditValue,
      secondaryLabel,
      secondaryValue,
      introParagraphs: introParagraphs.length > 0 ? introParagraphs : [subtitle],
      largeHeading,
      largeHeadingText,
      subHeading,
      subHeadingText,
      details: details.length > 0 ? details : [subtitle],
      featured: req.body?.featured !== undefined ? Boolean(req.body.featured) : true,
    };

    await saveJournalEntry(item);
    res.json(item);
  } catch (err) {
    handleRouteError(res, err, 'Unable to update journal entry.');
  }
});

app.delete('/api/admin/journal/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    if (!id) {
      res.status(400).json({ error: 'Entry id is required.' });
      return;
    }
    const deleted = await removeJournalEntry(id);
    if (!deleted) {
      res.status(404).json({ error: 'Journal entry not found in database.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    handleRouteError(res, err, 'Unable to delete journal entry.');
  }
});

// Contact Enquiries Inbox CRUD
app.get('/api/admin/enquiries', requireAdmin, async (_req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const items = await listEnquiries();
    res.json({ enquiries: items });
  } catch (err) {
    handleRouteError(res, err, 'Unable to load contact enquiries.');
  }
});

app.patch('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    const statusRaw = cleanString(req.body?.status, 24);
    if (
      !id ||
      !ALLOWED_ENQUIRY_STATUSES.includes(
        statusRaw as (typeof ALLOWED_ENQUIRY_STATUSES)[number],
      )
    ) {
      res.status(400).json({ error: 'Invalid enquiry status.' });
      return;
    }

    const updated = await updateEnquiryStatus(
      id,
      statusRaw as (typeof ALLOWED_ENQUIRY_STATUSES)[number],
    );
    if (!updated) {
      res.status(404).json({ error: 'Enquiry not found in database.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    handleRouteError(res, err, 'Unable to update enquiry status.');
  }
});

app.delete('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
  if (!ensureDatabaseAvailable(res)) return;
  try {
    const id = cleanString(req.params.id, 64);
    if (!id) {
      res.status(400).json({ error: 'Enquiry id is required.' });
      return;
    }
    const deleted = await removeEnquiry(id);
    if (!deleted) {
      res.status(404).json({ error: 'Enquiry not found in database.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    handleRouteError(res, err, 'Unable to delete enquiry.');
  }
});

// --- Search & Generative Engine Optimization (SEO & GEO) Endpoints ---

app.get('/robots.txt', (req, res) => {
  const baseUrl = resolveBaseUrl(req);
  res
    .setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    .type('text/plain; charset=utf-8')
    .send(buildRobotsTxt(baseUrl));
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = resolveBaseUrl(req);
    const portfolio = await getPublicPortfolio();
    res
      .setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
      .type('application/xml; charset=utf-8')
      .send(buildSitemapXml(baseUrl, portfolio));
  } catch {
    res.status(500).type('text/plain').send('Unable to generate sitemap.');
  }
});

app.get('/llms.txt', async (req, res) => {
  try {
    const baseUrl = resolveBaseUrl(req);
    const portfolio = await getPublicPortfolio();
    res
      .setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
      .type('text/plain; charset=utf-8')
      .send(buildLlmsTxt(baseUrl, portfolio));
  } catch {
    res.status(500).type('text/plain').send('Unable to generate llms.txt.');
  }
});

app.get('/llms-full.txt', async (req, res) => {
  try {
    const baseUrl = resolveBaseUrl(req);
    const portfolio = await getPublicPortfolio();
    res
      .setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
      .type('text/plain; charset=utf-8')
      .send(buildLlmsFullTxt(baseUrl, portfolio));
  } catch {
    res
      .status(500)
      .type('text/plain')
      .send('Unable to generate llms-full.txt.');
  }
});

// --- Production HTML Shell Resolution & SEO Injection ---

async function readBuiltHtmlTemplate(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), 'dist', '_index.html'),
    path.resolve(__dirname, 'dist', '_index.html'),
    path.resolve(__dirname, '..', 'dist', '_index.html'),
    path.resolve(process.cwd(), 'dist', 'index.html'),
    path.resolve(__dirname, 'dist', 'index.html'),
    path.resolve(__dirname, '..', 'dist', 'index.html'),
  ];

  for (const filePath of candidates) {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      // Try next location
    }
  }

  throw new Error('Built HTML template not found in dist/');
}

function registerProductionHtmlRoutes(): void {
  const distDir = path.resolve(process.cwd(), 'dist');

  if (!isVercel) {
    app.use(express.static(distDir, { index: false }));
  }

  app.get('/_index.html', (_req, res) => {
    res.status(404).type('text/plain').send('Not found');
  });

  app.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    try {
      const rawHtml = await readBuiltHtmlTemplate();
      const portfolio = await getPublicPortfolio();
      const enriched = injectHtmlSeoMeta(rawHtml, req, portfolio);
      const headers: Record<string, string> = {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      };
      if (isAdminPathRequest(req.path)) {
        headers['Cache-Control'] =
          'no-store, no-cache, must-revalidate, private';
        headers['Pragma'] = 'no-cache';
        headers['X-Robots-Tag'] = 'noindex, nofollow, noarchive';
      }
      res.status(200).set(headers).end(enriched);
    } catch (err) {
      next(err);
    }
  });
}

// In Vercel / production builds, attach the HTML routes immediately onto the exported app.
if (isProd || isVercel) {
  registerProductionHtmlRoutes();
}

// --- Local Server Boot (never executed inside Vercel Serverless Functions) ---

async function startLocalServer(): Promise<void> {
  await initDatabase();

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get(['/', ADMIN_PATH, `${ADMIN_PATH}/*`], async (req, res, next) => {
      try {
        const rawHtml = await fs.readFile(
          path.resolve(__dirname, 'index.html'),
          'utf-8',
        );
        const transformed = await vite.transformIndexHtml(
          req.originalUrl,
          rawHtml,
        );
        const portfolio = await getPublicPortfolio();
        const enriched = injectHtmlSeoMeta(transformed, req, portfolio);
        const headers: Record<string, string> = {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0',
        };
        if (isAdminPathRequest(req.path)) {
          headers['Cache-Control'] =
            'no-store, no-cache, must-revalidate, private';
          headers['Pragma'] = 'no-cache';
          headers['X-Robots-Tag'] = 'noindex, nofollow, noarchive';
        }
        res.status(200).set(headers).end(enriched);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

if (!isVercel) {
  startLocalServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
