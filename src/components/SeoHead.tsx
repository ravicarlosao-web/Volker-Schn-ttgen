import { useEffect } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import type {
  JournalEntry,
  PortfolioCategoryId,
  ProjectItem,
} from '../data/formtectureData';
import { type Language, useLanguage } from '../i18n/LanguageContext';
import { getLocalizedProject } from '../i18n/projectTranslations';
import {
  getLocalizedCategory,
  getLocalizedJournalEntry,
} from '../i18n/translations';
import { ADMIN_ROUTE_PATH } from '../utils/adminRoute';

interface SeoHeadProps {
  isAdminRoute: boolean;
  catalogueCategory: PortfolioCategoryId | null;
  selectedProject: ProjectItem | null;
  selectedEntry: JournalEntry | null;
}

const HOME_META: Record<
  Language,
  { title: string; description: string; locale: string }
> = {
  en: {
    title: 'Volker Schnüttgen — Sculptor & New Media Artist | Sintra',
    description:
      'Explore sculptures, oak and stone installations, exhibitions, and new media works by German artist Volker Schnüttgen in Sintra, Portugal.',
    locale: 'en_US',
  },
  pt: {
    title: 'Volker Schnüttgen — Escultor & Artista Multimédia | Sintra',
    description:
      'Explore esculturas em carvalho e pedra, instalações espaciais, exposições e obras de novos media de Volker Schnüttgen em Sintra, Portugal.',
    locale: 'pt_PT',
  },
  fr: {
    title: 'Volker Schnüttgen — Sculpteur & Artiste Nouveaux Médias | Sintra',
    description:
      'Découvrez les sculptures en chêne et pierre, installations spatiales, expositions et œuvres nouveaux médias de Volker Schnüttgen à Sintra, Portugal.',
    locale: 'fr_FR',
  },
  de: {
    title: 'Volker Schnüttgen — Bildhauer & Medienkünstler | Sintra',
    description:
      'Entdecken Sie Skulpturen aus Eiche und Stein, Rauminstallationen, Ausstellungen und Medienkunst von Volker Schnüttgen in Sintra, Portugal.',
    locale: 'de_DE',
  },
};

const FAQ_BY_LANGUAGE: Record<
  Language,
  Array<{ question: string; answer: string }>
> = {
  en: [
    {
      question: 'Who is Volker Schnüttgen?',
      answer:
        'Volker Schnüttgen (born 1961 in Attendorn, Germany) is a contemporary sculptor and new media artist living and working permanently in Sintra, Portugal since 1993. He trained at the Bremen University of Arts (1982) and completed a Master Degree in Media Art at FBAUP (2008).',
    },
    {
      question: 'What materials and mediums does Volker Schnüttgen work with?',
      answer:
        'His works are shaped primarily in territorial oak timber, stone, and folded steel, alongside spatial installations, engraving, collaborative choreography/sound performances such as Habitat (2010), and interactive new media.',
    },
    {
      question: 'Where is Volker Schnüttgen’s studio located?',
      answer:
        'His studio has been based permanently in Sintra, Portugal since 1993. From 2010 to 2016 he also served as Sculpture Professor at the Faculty of Fine Arts, University of Porto (FBAUP).',
    },
    {
      question: 'Who represents Volker Schnüttgen for exhibitions and acquisitions?',
      answer:
        'Volker Schnüttgen is represented by zet gallery. Curatorial, institutional, and gallery enquiries can be submitted via the Contact section or directly at mail@volker-schnuettgen.com.',
    },
  ],
  pt: [
    {
      question: 'Quem é Volker Schnüttgen?',
      answer:
        'Volker Schnüttgen (nascido em 1961 em Attendorn, Alemanha) é escultor e artista de novos media radicado permanentemente em Sintra, Portugal, desde 1993. Formou-se em escultura e gravura em Bremen (1982) e concluiu o Mestrado em Arte Multimédia na FBAUP (2008).',
    },
    {
      question: 'Que materiais e meios utiliza na sua obra?',
      answer:
        'Trabalha sobretudo com madeira de carvalho ligada ao território, pedra natural e aço, além de instalações espaciais, gravura, performances interdisciplinares como Habitat (2010) e arte multimédia interativa.',
    },
    {
      question: 'Onde se localiza o estúdio de Volker Schnüttgen?',
      answer:
        'O seu estúdio localiza-se permanentemente em Sintra, Portugal, desde 1993. Entre 2010 e 2016 foi também Professor de Escultura na FBAUP, no Porto.',
    },
    {
      question: 'Como contactar para exposições, encomendas ou aquisições?',
      answer:
        'Volker Schnüttgen é representado pela zet gallery. Pedidos curatoriais, institucionais ou de galeria podem ser enviados pelo formulário de contacto do site ou para mail@volker-schnuettgen.com.',
    },
  ],
  fr: [
    {
      question: 'Qui est Volker Schnüttgen ?',
      answer:
        'Volker Schnüttgen (né en 1961 à Attendorn, Allemagne) est un sculpteur et artiste nouveaux médias installé en permanence à Sintra, au Portugal, depuis 1993. Il a étudié à l’Université des Arts de Brême (1982) et obtenu un Master en Art Multimédia à la FBAUP (2008).',
    },
    {
      question: 'Avec quels matériaux et médiums travaille Volker Schnüttgen ?',
      answer:
        'Son œuvre privilégie le bois de chêne lié au territoire, la pierre naturelle et l’acier plié, ainsi que l’installation spatiale, la gravure, des performances interdisciplinaires telles que Habitat (2010) et les nouveaux médias interactifs.',
    },
    {
      question: 'Où se situe l’atelier de Volker Schnüttgen ?',
      answer:
        'Son atelier est établi en permanence à Sintra, Portugal, depuis 1993. De 2010 à 2016, il a également enseigné la sculpture à la Faculté des Beaux-Arts de l’Université de Porto (FBAUP).',
    },
    {
      question: 'Qui représente Volker Schnüttgen pour les expositions et acquisitions ?',
      answer:
        'Volker Schnüttgen est représenté par la zet gallery. Les demandes curatoriales, institutionnelles ou de galerie peuvent être envoyées via la section Contact ou à mail@volker-schnuettgen.com.',
    },
  ],
  de: [
    {
      question: 'Wer ist Volker Schnüttgen?',
      answer:
        'Volker Schnüttgen (geboren 1961 in Attendorn, Deutschland) ist Bildhauer und Medienkünstler und lebt und arbeitet seit 1993 dauerhaft in Sintra, Portugal. Er studierte ab 1982 in Bremen und schloss 2008 den Master in Medienkunst an der FBAUP ab.',
    },
    {
      question: 'Mit welchen Materialien und Medien arbeitet Volker Schnüttgen?',
      answer:
        'Im Zentrum stehen Skulpturen aus Eichenholz, Naturstein und gefaltetem Stahl sowie Rauminstallationen, Druckgrafik, interdisziplinäre Performance-Projekte wie Habitat (2010) und interaktive Medienkunst.',
    },
    {
      question: 'Wo befindet sich das Atelier von Volker Schnüttgen?',
      answer:
        'Sein Atelier befindet sich seit 1993 dauerhaft in Sintra, Portugal. Von 2010 bis 2016 lehrte er zudem als Dozent für Bildhauerei an der FBAUP in Porto.',
    },
    {
      question: 'Wer vertritt Volker Schnüttgen für Ausstellungen und Ankäufe?',
      answer:
        'Volker Schnüttgen wird durch die zet gallery vertreten. Kuratorische, institutionelle oder Galerieanfragen können über das Kontaktformular oder per E-Mail an mail@volker-schnuettgen.com gesendet werden.',
    },
  ],
};

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  if (typeof document === 'undefined') return;
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function truncateDesc(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function toAbsoluteUrl(origin: string, assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  if (assetPath.startsWith('/')) {
    if (assetPath.startsWith('/src/assets/')) {
      return `${origin}/assets/aistudio/image_f7f5a308.png`;
    }
    return `${origin}${assetPath}`;
  }
  return `${origin}/assets/aistudio/image_f7f5a308.png`;
}

export function SeoHead({
  isAdminRoute,
  catalogueCategory,
  selectedProject,
  selectedEntry,
}: SeoHeadProps) {
  const { language } = useLanguage();
  const { heroImage, categories, projects } = usePortfolioData();

  useEffect(() => {
    const origin = window.location.origin;
    const baseMeta = HOME_META[language];

    let pageTitle = baseMeta.title;
    let pageDescription = baseMeta.description;
    let ogType = 'profile';
    let ogImage = toAbsoluteUrl(origin, heroImage);
    let canonical = `${origin}/`;
    let robots =
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const locProject = selectedProject
      ? getLocalizedProject(selectedProject, language)
      : null;
    const locEntry = selectedEntry
      ? getLocalizedJournalEntry(selectedEntry, language)
      : null;
    const activeCatObj =
      catalogueCategory && catalogueCategory !== 'ALL'
        ? categories.find((c) => c.id === catalogueCategory)
        : null;
    const locCat = activeCatObj
      ? getLocalizedCategory(activeCatObj, language)
      : null;

    const extraGraph: Array<Record<string, unknown>> = [];

    if (isAdminRoute) {
      pageTitle = 'Studio Console — Volker Schnüttgen';
      pageDescription = 'Private studio console.';
      robots = 'noindex, nofollow, noarchive';
      canonical = `${origin}${ADMIN_ROUTE_PATH}`;
    } else if (locProject) {
      pageTitle = `${locProject.title} (${locProject.year}) — Volker Schnüttgen`;
      pageDescription = truncateDesc(
        `${locProject.medium} · ${locProject.location}. ${locProject.lead}`,
      );
      ogType = 'article';
      ogImage = toAbsoluteUrl(origin, locProject.image);
      canonical = `${origin}/?work=${encodeURIComponent(locProject.id)}`;
      extraGraph.push(
        {
          '@type': 'VisualArtwork',
          name: locProject.title,
          artform: locProject.typology,
          artMedium: locProject.medium,
          dateCreated: locProject.year,
          description: locProject.lead,
          image: ogImage,
          url: canonical,
          inLanguage: language,
          creator: { '@id': `${origin}/#artist` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Volker Schnüttgen', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${origin}/?portfolio=all` },
            { '@type': 'ListItem', position: 3, name: locProject.title, item: canonical },
          ],
        },
      );
    } else if (locEntry) {
      pageTitle = `${locEntry.title} — Volker Schnüttgen`;
      pageDescription = truncateDesc(locEntry.subtitle);
      ogType = 'article';
      ogImage = toAbsoluteUrl(origin, locEntry.image);
      canonical = `${origin}/?journal=${encodeURIComponent(locEntry.id)}`;
      extraGraph.push(
        locEntry.category === 'EXHIBITION'
          ? {
              '@type': 'ExhibitionEvent',
              name: locEntry.title,
              description: locEntry.subtitle,
              image: ogImage,
              url: canonical,
              inLanguage: language,
              performer: { '@id': `${origin}/#artist` },
            }
          : {
              '@type': 'Article',
              headline: locEntry.title,
              description: locEntry.subtitle,
              image: ogImage,
              url: canonical,
              inLanguage: language,
              about: { '@id': `${origin}/#artist` },
            },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Volker Schnüttgen', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: locEntry.title, item: canonical },
          ],
        },
      );
    } else if (catalogueCategory !== null) {
      if (locCat) {
        pageTitle = `${locCat.title} — Volker Schnüttgen Portfolio`;
        pageDescription = truncateDesc(
          `${locCat.categoryLine}. ${locCat.metaLine} — Works by Volker Schnüttgen.`,
        );
        ogImage = toAbsoluteUrl(origin, locCat.image);
        canonical = `${origin}/?category=${encodeURIComponent(locCat.id)}`;
      } else {
        pageTitle = 'Works Catalogue — Volker Schnüttgen';
        pageDescription = truncateDesc(
          `Complete archive of ${projects.length} sculptures, spatial installations, public works, and new media works by Volker Schnüttgen.`,
        );
        canonical = `${origin}/?portfolio=all`;
      }
      extraGraph.push({
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: canonical,
        inLanguage: language,
      });
    } else {
      const faqItems = FAQ_BY_LANGUAGE[language];
      extraGraph.push(
        {
          '@type': 'ProfilePage',
          name: baseMeta.title,
          url: `${origin}/`,
          inLanguage: language,
          mainEntity: { '@id': `${origin}/#artist` },
        },
        {
          '@type': 'FAQPage',
          inLanguage: language,
          mainEntity: faqItems.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })),
        },
      );
    }

    document.title = pageTitle;
    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:locale', baseMeta.locale);
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertLink('canonical', canonical);
    if (!isAdminRoute) {
      upsertLink('alternate', `${origin}/`, 'en');
      upsertLink('alternate', `${origin}/?lang=pt`, 'pt');
      upsertLink('alternate', `${origin}/?lang=fr`, 'fr');
      upsertLink('alternate', `${origin}/?lang=de`, 'de');
      upsertLink('alternate', `${origin}/`, 'x-default');
    }

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${origin}/#artist`,
          name: 'Volker Schnüttgen',
          jobTitle: 'Sculptor and New Media Artist',
          birthDate: '1961',
          birthPlace: { '@type': 'Place', name: 'Attendorn, Germany' },
          homeLocation: {
            '@type': 'Place',
            name: 'Sintra, Portugal',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 38.8029,
              longitude: -9.3817,
            },
          },
          email: 'mailto:mail@volker-schnuettgen.com',
          telephone: '+351-962-370-193',
          url: `${origin}/`,
          knowsAbout: [
            'Sculpture',
            'Oak Wood Sculpture',
            'Stone Sculpture',
            'Spatial Installation',
            'New Media Art',
            'Engraving',
            'Public Art',
          ],
          award: [
            'Grant from the Portuguese Ministry of Foreign Affairs (1992)',
            'Culture Award from the Council of Olpe (1999)',
            'Calouste Gulbenkian Foundation Scholarship Berlin (2004)',
            'Capital Berlin Cultural Fund (2010)',
          ],
        },
        {
          '@type': 'ArtGallery',
          '@id': `${origin}/#representation`,
          name: 'zet gallery',
        },
        {
          '@type': 'Place',
          '@id': `${origin}/#studio`,
          name: 'Volker Schnüttgen Studio',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Sintra',
            addressRegion: 'Lisboa',
            addressCountry: 'PT',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 38.8029,
            longitude: -9.3817,
          },
        },
        ...extraGraph,
      ],
    };

    let script = document.getElementById('vs-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'vs-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaGraph);
  }, [
    language,
    isAdminRoute,
    catalogueCategory,
    selectedProject,
    selectedEntry,
    heroImage,
    categories,
    projects,
  ]);

  return null;
}
