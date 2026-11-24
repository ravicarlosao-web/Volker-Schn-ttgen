import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  createAdminToken,
  hashPassword,
  isEnvPasscodeConfigured,
  requireAdmin,
  verifyEnvPasscode,
  verifyPasswordHash,
} from './server/auth.ts';
import {
  isCloudinaryConfigured,
  uploadImageAsset,
} from './server/cloudinary.ts';
import {
  claimInitialAdminHash,
  getAdminCredentialHash,
  getPublicPortfolio,
  initDatabase,
  insertEnquiry,
  isTursoCloudConfigured,
  listEnquiries,
  removeCategory,
  removeEnquiry,
  removeJournalEntry,
  removeProject,
  saveCategory,
  saveJournalEntry,
  saveProject,
  updateEnquiryStatus,
  updateHeroImageSetting,
} from './server/db.ts';
import {
  ALLOWED_ENQUIRY_STATUSES,
  ALLOWED_JOURNAL_CATEGORIES,
  ALLOWED_TYPOLOGIES,
  cleanString,
  isSafeAssetUrl,
  isValidEmail,
  normalizeCategoryId,
  slugifyLower,
} from './server/validators.ts';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
  injectHtmlSeoMeta,
  resolveBaseUrl,
} from './server/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per artwork image
  },
});

async function startServer(): Promise<void> {
  await initDatabase();

  const app = express();
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';
  const uploadsDir = path.resolve(__dirname, 'uploads');

  app.disable('x-powered-by');

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  app.use('/uploads', express.static(uploadsDir));
  app.use(express.json({ limit: '1mb' }));

  // --- Public API Routes ---

  app.get('/api/portfolio', async (_req, res) => {
    try {
      const data = await getPublicPortfolio();
      res.json(data);
    } catch {
      res.status(500).json({ error: 'Unable to load portfolio archive.' });
    }
  });

  app.post('/api/enquiries', async (req, res) => {
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
    } catch {
      res.status(500).json({ error: 'Unable to submit enquiry.' });
    }
  });

  // --- Admin Auth Routes ---

  app.get('/api/admin/auth/status', async (_req, res) => {
    try {
      const envConfigured = isEnvPasscodeConfigured();
      const storedHash = envConfigured ? null : await getAdminCredentialHash();
      res.json({
        envPasscodeConfigured: envConfigured,
        needsSetup: !envConfigured && storedHash === null,
        storage: {
          tursoCloud: isTursoCloudConfigured(),
          cloudinaryConfigured: isCloudinaryConfigured(),
        },
      });
    } catch {
      res.status(500).json({ error: 'Unable to inspect admin status.' });
    }
  });

  app.post('/api/admin/auth/setup', async (req, res) => {
    try {
      if (isEnvPasscodeConfigured()) {
        res.status(409).json({
          error: 'An environment admin passcode is already configured.',
        });
        return;
      }

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

      const token = createAdminToken();
      res.status(201).json({ token });
    } catch {
      res.status(500).json({ error: 'Unable to initialize admin credentials.' });
    }
  });

  app.post('/api/admin/auth/login', async (req, res) => {
    try {
      const password =
        typeof req.body?.password === 'string' ? req.body.password.trim() : '';
      if (!password) {
        res.status(400).json({ error: 'Password is required.' });
        return;
      }

      if (isEnvPasscodeConfigured()) {
        if (!verifyEnvPasscode(password)) {
          res.status(401).json({ error: 'Invalid admin credentials.' });
          return;
        }
        res.json({ token: createAdminToken() });
        return;
      }

      const storedHash = await getAdminCredentialHash();
      if (!storedHash || !verifyPasswordHash(password, storedHash)) {
        res.status(401).json({ error: 'Invalid admin credentials.' });
        return;
      }

      res.json({ token: createAdminToken() });
    } catch {
      res.status(500).json({ error: 'Unable to sign in.' });
    }
  });

  // --- Protected Admin Routes ---

  app.get('/api/admin/status', requireAdmin, async (_req, res) => {
    try {
      const [portfolio, enquiries] = await Promise.all([
        getPublicPortfolio(),
        listEnquiries(),
      ]);
      res.json({
        tursoCloud: isTursoCloudConfigured(),
        cloudinaryConfigured: isCloudinaryConfigured(),
        counts: {
          categories: portfolio.categories.length,
          projects: portfolio.projects.length,
          journal: portfolio.journalEntries.length,
          enquiriesNew: enquiries.filter((e) => e.status === 'NEW').length,
          enquiriesTotal: enquiries.length,
        },
      });
    } catch {
      res.status(500).json({ error: 'Unable to load admin status.' });
    }
  });

  app.post(
    '/api/admin/upload',
    requireAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          res.status(400).json({ error: 'File upload rejected (5MB max).' });
          return;
        }
        next();
      });
    },
    async (req, res) => {
      try {
        if (!req.file || !req.file.buffer) {
          res.status(400).json({ error: 'No image file provided.' });
          return;
        }

        const result = await uploadImageAsset(req.file.buffer, uploadsDir);
        res.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Upload failed';
        if (message === 'UNSUPPORTED_IMAGE_FILE') {
          res.status(400).json({
            error: 'Unsupported file format. Please upload JPEG, PNG, WEBP, or GIF.',
          });
          return;
        }
        res.status(500).json({ error: 'Image upload failed.' });
      }
    },
  );

  app.put('/api/admin/hero', requireAdmin, async (req, res) => {
    try {
      const heroImage = cleanString(req.body?.heroImage, 1200);
      if (!isSafeAssetUrl(heroImage)) {
        res.status(400).json({ error: 'Please provide a valid image URL.' });
        return;
      }

      await updateHeroImageSetting(heroImage);
      res.json({ ok: true, heroImage });
    } catch {
      res.status(500).json({ error: 'Unable to update Hero image.' });
    }
  });

  // Categories CRUD
  app.post('/api/admin/categories', requireAdmin, async (req, res) => {
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

      const item = { id, code, title, categoryLine, metaLine, image };
      await saveCategory(item);
      res.status(201).json(item);
    } catch {
      res.status(500).json({ error: 'Unable to save category.' });
    }
  });

  app.put('/api/admin/categories/:id', requireAdmin, async (req, res) => {
    try {
      const id = cleanString(req.params.id, 48);
      const title = cleanString(req.body?.title, 80);
      const code = cleanString(req.body?.code, 16);
      const categoryLine = cleanString(req.body?.categoryLine, 160);
      const metaLine = cleanString(req.body?.metaLine, 160);
      const image = cleanString(req.body?.image, 1200);

      if (!id || !title || !code || !categoryLine || !isSafeAssetUrl(image)) {
        res.status(400).json({ error: 'Invalid category payload.' });
        return;
      }

      const item = { id, code, title, categoryLine, metaLine, image };
      await saveCategory(item);
      res.json(item);
    } catch {
      res.status(500).json({ error: 'Unable to update category.' });
    }
  });

  app.delete('/api/admin/categories/:id', requireAdmin, async (req, res) => {
    try {
      const id = cleanString(req.params.id, 48);
      if (!id) {
        res.status(400).json({ error: 'Category id is required.' });
        return;
      }
      await removeCategory(id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Unable to delete category.' });
    }
  });

  // Projects / Artworks CRUD
  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    try {
      const title = cleanString(req.body?.title, 160);
      const id = slugifyLower(cleanString(req.body?.id || title, 64));
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
        cleanString(req.body?.categoryLine, 160) || `${typology} · ${portfolioCategory}`;
      const medium = cleanString(req.body?.medium, 160) || typology;
      const context = cleanString(req.body?.context, 160) || `${location} · ${year}`;
      const lead = cleanString(req.body?.lead, 600, true);
      const image = cleanString(req.body?.image, 1200);

      if (!id || !title || !lead || !isSafeAssetUrl(image)) {
        res.status(400).json({
          error: 'Work title, description, and a valid primary image URL are required.',
        });
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
    } catch {
      res.status(500).json({ error: 'Unable to save work.' });
    }
  });

  app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
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
    } catch {
      res.status(500).json({ error: 'Unable to update work.' });
    }
  });

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    try {
      const id = cleanString(req.params.id, 64);
      if (!id) {
        res.status(400).json({ error: 'Work id is required.' });
        return;
      }
      await removeProject(id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Unable to delete work.' });
    }
  });

  // Journal / Exhibitions CRUD
  app.post('/api/admin/journal', requireAdmin, async (req, res) => {
    try {
      const title = cleanString(req.body?.title, 200);
      const id = slugifyLower(cleanString(req.body?.id || title, 64));
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
        res.status(400).json({
          error: 'Entry title, subtitle, and a valid cover image URL are required.',
        });
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
      res.status(201).json(item);
    } catch {
      res.status(500).json({ error: 'Unable to save journal entry.' });
    }
  });

  app.put('/api/admin/journal/:id', requireAdmin, async (req, res) => {
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
    } catch {
      res.status(500).json({ error: 'Unable to update journal entry.' });
    }
  });

  app.delete('/api/admin/journal/:id', requireAdmin, async (req, res) => {
    try {
      const id = cleanString(req.params.id, 64);
      if (!id) {
        res.status(400).json({ error: 'Entry id is required.' });
        return;
      }
      await removeJournalEntry(id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Unable to delete journal entry.' });
    }
  });

  // Contact Enquiries Inbox CRUD
  app.get('/api/admin/enquiries', requireAdmin, async (_req, res) => {
    try {
      const items = await listEnquiries();
      res.json({ enquiries: items });
    } catch {
      res.status(500).json({ error: 'Unable to load contact enquiries.' });
    }
  });

  app.patch('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
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

      await updateEnquiryStatus(
        id,
        statusRaw as (typeof ALLOWED_ENQUIRY_STATUSES)[number],
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Unable to update enquiry status.' });
    }
  });

  app.delete('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
    try {
      const id = cleanString(req.params.id, 64);
      if (!id) {
        res.status(400).json({ error: 'Enquiry id is required.' });
        return;
      }
      await removeEnquiry(id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Unable to delete enquiry.' });
    }
  });

  // --- Search & Generative Engine Optimization (SEO & GEO) Endpoints ---
  app.get('/robots.txt', (req, res) => {
    const baseUrl = resolveBaseUrl(req);
    res.type('text/plain; charset=utf-8').send(buildRobotsTxt(baseUrl));
  });

  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = resolveBaseUrl(req);
      const portfolio = await getPublicPortfolio();
      res
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
        .type('text/plain; charset=utf-8')
        .send(buildLlmsFullTxt(baseUrl, portfolio));
    } catch {
      res
        .status(500)
        .type('text/plain')
        .send('Unable to generate llms-full.txt.');
    }
  });

  // --- Vite Dev Middleware / Production Static Serving ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get(['/', '/admin'], async (req, res, next) => {
      try {
        const rawHtml = await fs.readFile(
          path.resolve(__dirname, 'index.html'),
          'utf-8',
        );
        const transformed = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        const portfolio = await getPublicPortfolio();
        const enriched = injectHtmlSeoMeta(transformed, req, portfolio);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(enriched);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      try {
        const rawHtml = await fs.readFile(
          path.join(distDir, 'index.html'),
          'utf-8',
        );
        const portfolio = await getPublicPortfolio();
        const enriched = injectHtmlSeoMeta(rawHtml, req, portfolio);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(enriched);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
