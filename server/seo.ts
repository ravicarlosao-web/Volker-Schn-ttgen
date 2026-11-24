import type { Request } from 'express';
import type {
  JournalEntry,
  PortfolioCategoryItem,
  ProjectItem,
} from '../src/data/formtectureData.ts';
import { normalizeAdminPath } from './validators.ts';

export interface PublicPortfolioData {
  heroImage: string;
  categories: PortfolioCategoryItem[];
  projects: ProjectItem[];
  journalEntries: JournalEntry[];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateMeta(value: string, max = 158): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function resolveBaseUrl(req: Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

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
      : req.headers.host) || 'localhost:3000';

  const safeHost = /^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(rawHost)
    ? rawHost
    : 'localhost:3000';

  return `${proto}://${safeHost}`;
}

export function resolveAbsoluteAssetUrl(baseUrl: string, assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  if (assetPath.startsWith('/')) {
    if (assetPath.startsWith('/src/assets/')) {
      return `${baseUrl}/assets/aistudio/image_f7f5a308.png`;
    }
    return `${baseUrl}${assetPath}`;
  }
  return `${baseUrl}/assets/aistudio/image_f7f5a308.png`;
}

export function buildRobotsTxt(baseUrl: string): string {
  return [
    '# Search & Generative Engine Crawler Directives — Volker Schnüttgen',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# Major Search Engines',
    'User-agent: Googlebot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# Generative AI & Answer Engines (GEO)',
    'User-agent: GPTBot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `# LLMs Knowledge Index: ${baseUrl}/llms.txt`,
    `# LLMs Full Archive: ${baseUrl}/llms-full.txt`,
    '',
  ].join('\n');
}

export function buildSitemapXml(
  baseUrl: string,
  portfolio: PublicPortfolioData,
): string {
  const lastmod = new Date().toISOString().split('T')[0];

  const urls: Array<{
    loc: string;
    priority: string;
    changefreq: string;
    image?: string;
    title?: string;
    alternates?: boolean;
  }> = [
    {
      loc: `${baseUrl}/`,
      priority: '1.0',
      changefreq: 'weekly',
      image: resolveAbsoluteAssetUrl(baseUrl, portfolio.heroImage),
      title: 'Volker Schnüttgen — Sculptor & New Media Artist (Sintra, Portugal)',
      alternates: true,
    },
    {
      loc: `${baseUrl}/?portfolio=all`,
      priority: '0.9',
      changefreq: 'weekly',
      alternates: true,
    },
  ];

  for (const cat of portfolio.categories) {
    urls.push({
      loc: `${baseUrl}/?category=${encodeURIComponent(cat.id)}`,
      priority: '0.8',
      changefreq: 'weekly',
      image: resolveAbsoluteAssetUrl(baseUrl, cat.image),
      title: `${cat.title} — Volker Schnüttgen Portfolio`,
    });
  }

  for (const work of portfolio.projects) {
    urls.push({
      loc: `${baseUrl}/?work=${encodeURIComponent(work.id)}`,
      priority: '0.85',
      changefreq: 'monthly',
      image: resolveAbsoluteAssetUrl(baseUrl, work.image),
      title: `${work.title} (${work.year}) — ${work.medium}`,
    });
  }

  for (const entry of portfolio.journalEntries) {
    urls.push({
      loc: `${baseUrl}/?journal=${encodeURIComponent(entry.id)}`,
      priority: '0.85',
      changefreq: 'monthly',
      image: resolveAbsoluteAssetUrl(baseUrl, entry.image),
      title: entry.title,
    });
  }

  const itemsXml = urls
    .map((u) => {
      const altXml = u.alternates
        ? [
            `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(u.loc)}" />`,
            `    <xhtml:link rel="alternate" hreflang="pt" href="${escapeXml(u.loc)}${u.loc.includes('?') ? '&amp;' : '?'}lang=pt" />`,
            `    <xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(u.loc)}${u.loc.includes('?') ? '&amp;' : '?'}lang=fr" />`,
            `    <xhtml:link rel="alternate" hreflang="de" href="${escapeXml(u.loc)}${u.loc.includes('?') ? '&amp;' : '?'}lang=de" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(u.loc)}" />`,
          ].join('\n')
        : '';

      const imageXml = u.image
        ? [
            '    <image:image>',
            `      <image:loc>${escapeXml(u.image)}</image:loc>`,
            u.title ? `      <image:title>${escapeXml(u.title)}</image:title>` : '',
            '    </image:image>',
          ]
            .filter(Boolean)
            .join('\n')
        : '';

      return [
        '  <url>',
        `    <loc>${escapeXml(u.loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${u.changefreq}</changefreq>`,
        `    <priority>${u.priority}</priority>`,
        altXml,
        imageXml,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    itemsXml,
    '</urlset>',
  ].join('\n');
}

export function buildLlmsTxt(
  baseUrl: string,
  portfolio: PublicPortfolioData,
): string {
  const categoryLines = portfolio.categories
    .map(
      (c) =>
        `- [${c.title}](${baseUrl}/?category=${encodeURIComponent(c.id)}): ${c.categoryLine} (${c.metaLine})`,
    )
    .join('\n');

  const featuredWorks = portfolio.projects
    .slice(0, 8)
    .map(
      (p) =>
        `- [${p.title} (${p.year})](${baseUrl}/?work=${encodeURIComponent(p.id)}): ${p.medium} · ${p.location} — ${p.lead}`,
    )
    .join('\n');

  const journalLines = portfolio.journalEntries
    .map(
      (j) =>
        `- [${j.title}](${baseUrl}/?journal=${encodeURIComponent(j.id)}): ${j.category} · ${j.date} — ${j.subtitle}`,
    )
    .join('\n');

  return `# Volker Schnüttgen

> German sculptor and new media artist born in Attendorn, Germany (1961), living and working permanently in Sintra, Portugal since 1993. Represented by zet gallery. Primary materials include territorial oak timber, stone, folded steel, spatial installations, choreography co-productions, engraving, and interactive media art.

## Canonical Facts & Biography

- **Full Name**: Volker Schnüttgen
- **Born**: 1961, Attendorn, Germany
- **Studio Location**: Sintra, Portugal (permanent since 1993)
- **Education**: Studied sculpture and engraving at the University of the Arts Bremen (HfK Bremen, begun 1982); Master Degree in Media Art at the Faculty of Fine Arts, University of Porto (FBAUP, 2008)
- **Academic Role**: Sculpture Professor at FBAUP (2010–2016)
- **Awards & Fellowships**: Portuguese Ministry of Foreign Affairs grant (1992); Culture Award from the Council of Olpe (1999); Calouste Gulbenkian Foundation scholarship in Berlin (2004); Capital Berlin Cultural Fund (2010)
- **Gallery Representation**: zet gallery (curated exhibitions & acquisitions)
- **Direct Contact**: mail@volker-schnuettgen.com · +351 962 370 193

## Primary Archive & Endpoints

- [Homepage & Studio Overview](${baseUrl}/): Core index, artistic practice, biography, exhibitions, and contact
- [Full Works Catalogue](${baseUrl}/?portfolio=all): Complete catalog of ${portfolio.projects.length} sculptural and media works
- [Complete LLM Dossier](${baseUrl}/llms-full.txt): Unabridged structured descriptions of all works, materials, and exhibitions

## Medium Categories

${categoryLines}

## Selected Works

${featuredWorks}

## Exhibitions & Monograph Publications

${journalLines}
`;
}

export function buildLlmsFullTxt(
  baseUrl: string,
  portfolio: PublicPortfolioData,
): string {
  const categoriesBlock = portfolio.categories
    .map(
      (c) =>
        `### ${c.code} — ${c.title}\n- URL: ${baseUrl}/?category=${encodeURIComponent(c.id)}\n- Medium Focus: ${c.categoryLine}\n- Themes: ${c.metaLine}\n`,
    )
    .join('\n');

  const projectsBlock = portfolio.projects
    .map(
      (p) =>
        `### ${p.title} (${p.year})\n- URL: ${baseUrl}/?work=${encodeURIComponent(p.id)}\n- Category: ${p.portfolioCategory} (${p.typology})\n- Location: ${p.location}\n- Medium: ${p.medium}\n- Context: ${p.context}\n- Overview: ${p.lead}\n- Notes:\n${p.steps.map((s) => `  - **${s.label}**: ${s.text}`).join('\n')}\n`,
    )
    .join('\n');

  const journalBlock = portfolio.journalEntries
    .map(
      (j) =>
        `### ${j.title}\n- URL: ${baseUrl}/?journal=${encodeURIComponent(j.id)}\n- Type: ${j.category} · ${j.date}\n- ${j.creditLabel}: ${j.creditValue}\n- ${j.secondaryLabel}: ${j.secondaryValue}\n- Summary: ${j.subtitle}\n- Editorial Context:\n${j.introParagraphs.map((p) => `  ${p}\n`).join('')}- ${j.largeHeading}: ${j.largeHeadingText}\n- ${j.subHeading}: ${j.subHeadingText}\n`,
    )
    .join('\n');

  return `# Volker Schnüttgen — Complete Archive Dossier

> Sculptor & New Media Artist · Attendorn, 1961 / Sintra, Portugal (since 1993) · Represented by zet gallery.

## Biography & Practice

Born in Attendorn, Germany, in 1961, Volker Schnüttgen began studying sculpture and engraving at the Bremen University of Arts in 1982 and completed his Master Degree in Media Art at FBAUP in 2008. Recipient of a Portuguese Ministry of Foreign Affairs grant (1992), the Culture Award from the Council of Olpe (1999), a Calouste Gulbenkian Foundation scholarship in Berlin (2004), and support from the Capital Berlin Cultural Fund (2010), he was a Sculpture Professor at FBAUP from 2010 to 2016 and exhibits since 1986.

Disciplines:
1. **Sculpture**: Works shaped primarily in oak timber and stone tied to territory, establishing signs rooted in archaic figuration and dolmen geometry.
2. **Installation**: Spatial ensembles structuring rooms or landscapes, such as O Bosque (Trindade) (2019).
3. **Performance & Collaboration**: Cross-disciplinary productions such as Habitat (2010) with dance collective LaborGras at Radialsystem V, Berlin.
4. **Engraving**: Line precision, incision, and surface discipline rooted in Bremen (1982).
5. **New Media**: Interactive spatial works informed by Berlin (2004) and FBAUP Media Art (2008).

Contact:
- Email: mail@volker-schnuettgen.com
- Telephone: +351 962 370 193
- Studio: Sintra, Portugal
- Representation: zet gallery

## Portfolio Categories

${categoriesBlock}

## Complete Works (${portfolio.projects.length})

${projectsBlock}

## Exhibitions & Publications (${portfolio.journalEntries.length})

${journalBlock}
`;
}

export function injectHtmlSeoMeta(
  html: string,
  req: Request,
  portfolio: PublicPortfolioData,
): string {
  const baseUrl = resolveBaseUrl(req);
  const workId = typeof req.query.work === 'string' ? req.query.work : '';
  const journalId = typeof req.query.journal === 'string' ? req.query.journal : '';
  const categoryId = typeof req.query.category === 'string' ? req.query.category : '';
  const isPortfolioAll = req.query.portfolio === 'all';
  const adminPath = normalizeAdminPath(
    process.env.ADMIN_PATH || process.env.VITE_ADMIN_PATH,
  );
  const normalizedReqPath = req.path.replace(/\/+$/, '') || '/';
  const isAdmin =
    normalizedReqPath === adminPath ||
    normalizedReqPath.startsWith(`${adminPath}/`);

  let title = 'Volker Schnüttgen — Sculptor & New Media Artist | Sintra';
  let description =
    'Explore sculptures, oak and stone installations, exhibitions, and new media works by German artist Volker Schnüttgen in Sintra, Portugal.';
  let ogType = 'profile';
  let ogImage = resolveAbsoluteAssetUrl(baseUrl, portfolio.heroImage);
  let canonicalUrl = `${baseUrl}/`;
  let robots =
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const matchedWork = workId
    ? portfolio.projects.find((p) => p.id === workId)
    : undefined;
  const matchedJournal = journalId
    ? portfolio.journalEntries.find((j) => j.id === journalId)
    : undefined;
  const matchedCategory = categoryId
    ? portfolio.categories.find((c) => c.id === categoryId)
    : undefined;

  let routeSchema: Record<string, unknown> | null = null;

  const reqLangRaw = typeof req.query.lang === 'string' ? req.query.lang : '';
  const contentLocale =
    reqLangRaw === 'pt' || reqLangRaw === 'fr' ? reqLangRaw : null;

  if (isAdmin) {
    title = 'Studio Console — Volker Schnüttgen';
    description = 'Private studio console.';
    robots = 'noindex, nofollow, noarchive';
    canonicalUrl = `${baseUrl}${adminPath}`;
  } else if (matchedWork) {
    const tWork = contentLocale ? matchedWork.translations?.[contentLocale] : undefined;
    const workTitle = tWork?.title?.trim() || matchedWork.title;
    const workMedium = tWork?.medium?.trim() || matchedWork.medium;
    const workLead = tWork?.lead?.trim() || matchedWork.lead;
    title = `${workTitle} (${matchedWork.year}) — Volker Schnüttgen`;
    description = truncateMeta(
      `${workMedium} · ${matchedWork.location}. ${workLead}`,
    );
    ogType = 'article';
    ogImage = resolveAbsoluteAssetUrl(baseUrl, matchedWork.image);
    canonicalUrl = `${baseUrl}/?work=${encodeURIComponent(matchedWork.id)}`;
    routeSchema = {
      '@type': 'VisualArtwork',
      name: workTitle,
      artform: matchedWork.typology,
      artMedium: workMedium,
      dateCreated: matchedWork.year,
      description: workLead,
      image: ogImage,
      url: canonicalUrl,
      creator: { '@id': `${baseUrl}/#artist` },
    };
  } else if (matchedJournal) {
    const tJournal = contentLocale
      ? matchedJournal.translations?.[contentLocale]
      : undefined;
    const journalTitle = tJournal?.title?.trim() || matchedJournal.title;
    const journalSubtitle =
      tJournal?.subtitle?.trim() || matchedJournal.subtitle;
    title = `${journalTitle} — Volker Schnüttgen`;
    description = truncateMeta(journalSubtitle);
    ogType = 'article';
    ogImage = resolveAbsoluteAssetUrl(baseUrl, matchedJournal.image);
    canonicalUrl = `${baseUrl}/?journal=${encodeURIComponent(matchedJournal.id)}`;
    routeSchema =
      matchedJournal.category === 'EXHIBITION'
        ? {
            '@type': 'ExhibitionEvent',
            name: journalTitle,
            description: journalSubtitle,
            image: ogImage,
            url: canonicalUrl,
            performer: { '@id': `${baseUrl}/#artist` },
          }
        : {
            '@type': 'Article',
            headline: journalTitle,
            description: journalSubtitle,
            image: ogImage,
            url: canonicalUrl,
            about: { '@id': `${baseUrl}/#artist` },
          };
  } else if (matchedCategory) {
    const tCat = contentLocale
      ? matchedCategory.translations?.[contentLocale]
      : undefined;
    const catTitle = tCat?.title?.trim() || matchedCategory.title;
    const catLine = tCat?.categoryLine?.trim() || matchedCategory.categoryLine;
    const catMeta = tCat?.metaLine?.trim() || matchedCategory.metaLine;
    title = `${catTitle} Works — Volker Schnüttgen`;
    description = truncateMeta(
      `${catLine}. ${catMeta} — Sculptural works by Volker Schnüttgen.`,
    );
    ogImage = resolveAbsoluteAssetUrl(baseUrl, matchedCategory.image);
    canonicalUrl = `${baseUrl}/?category=${encodeURIComponent(matchedCategory.id)}`;
    routeSchema = {
      '@type': 'CollectionPage',
      name: `${catTitle} — Volker Schnüttgen`,
      description,
      url: canonicalUrl,
    };
  } else if (isPortfolioAll) {
    title = 'Works Catalogue — Volker Schnüttgen';
    description = `Browse all ${portfolio.projects.length} sculptures, spatial installations, public works, and new media projects by Volker Schnüttgen.`;
    canonicalUrl = `${baseUrl}/?portfolio=all`;
    routeSchema = {
      '@type': 'CollectionPage',
      name: 'Volker Schnüttgen — Complete Works Catalogue',
      description,
      url: canonicalUrl,
    };
  } else {
    routeSchema = {
      '@type': 'ProfilePage',
      url: `${baseUrl}/`,
      name: title,
      mainEntity: { '@id': `${baseUrl}/#artist` },
    };
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#artist`,
        name: 'Volker Schnüttgen',
        jobTitle: 'Sculptor and New Media Artist',
        birthDate: '1961',
        birthPlace: { '@type': 'Place', name: 'Attendorn, Germany' },
        homeLocation: {
          '@type': 'Place',
          name: 'Sintra, Portugal',
          geo: { '@type': 'GeoCoordinates', latitude: 38.8029, longitude: -9.3817 },
        },
        email: 'mailto:mail@volker-schnuettgen.com',
        telephone: '+351-962-370-193',
        url: `${baseUrl}/`,
      },
      {
        '@type': 'ArtGallery',
        '@id': `${baseUrl}/#representation`,
        name: 'zet gallery',
      },
      ...(routeSchema ? [routeSchema] : []),
    ],
  };

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtmlAttr(description)}" />`,
  );
  out = out.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtmlAttr(robots)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtmlAttr(ogType)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(title)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(description)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(title)}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImage)}" />`,
  );

  const dynamicTags = [
    `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtmlAttr(`${baseUrl}/`)}" />`,
    `<link rel="alternate" hreflang="pt" href="${escapeHtmlAttr(`${baseUrl}/?lang=pt`)}" />`,
    `<link rel="alternate" hreflang="fr" href="${escapeHtmlAttr(`${baseUrl}/?lang=fr`)}" />`,
    `<link rel="alternate" hreflang="de" href="${escapeHtmlAttr(`${baseUrl}/?lang=de`)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtmlAttr(`${baseUrl}/`)}" />`,
  ].join('\n    ');

  out = out.replace('</head>', `    ${dynamicTags}\n  </head>`);
  out = out.replace(
    /<script id="vs-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="vs-structured-data" type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`,
  );

  return out;
}
