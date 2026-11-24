export interface FloorItem {
  id: 'index' | 'projects' | 'practice' | 'studio' | 'journal' | 'contact';
  code: string;
  label: string;
  elevation: string;
  sectionEyebrow: string;
  theme: 'light' | 'dark';
}

export interface ProjectStep {
  label: string;
  text: string;
}

export type PortfolioCategory = string;
export type PortfolioCategoryId = 'ALL' | PortfolioCategory;

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  organisation: string;
  location: string;
  subject: string;
  scope: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export interface PortfolioCategoryItem {
  id: PortfolioCategory;
  code: string;
  title: string;
  categoryLine: string;
  metaLine: string;
  image: string;
}

export interface ProjectItem {
  id: string;
  floor: string;
  title: string;
  location: string;
  year: string;
  typology: 'SCULPTURE' | 'INSTALLATION' | 'SITE & PUBLIC' | 'SERIES';
  portfolioCategory: PortfolioCategory;
  categoryLine: string;
  medium: string;
  context: string;
  lead: string;
  image: string;
  gallery: [string, string, string];
  steps: [ProjectStep, ProjectStep, ProjectStep];
  featured: boolean;
}

export interface DisciplineItem {
  id: string;
  code: string;
  title: string;
  description: string;
  tags: string[];
}

export interface StudioStat {
  value: string;
  unit?: string;
  label: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  category: 'EXHIBITION' | 'PUBLICATION';
  title: string;
  subtitle: string;
  image: string;
  creditLabel: string;
  creditValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  introParagraphs: string[];
  largeHeading: string;
  largeHeadingText: string;
  subHeading: string;
  subHeadingText: string;
  details: string[];
  featured: boolean;
}

export const HERO_IMAGE = '/src/assets/images/color_hero_oak_stone_1795365610296.jpg';
export const PRACTICE_IMAGE = '/src/assets/images/color_practice_studio_1795365610802.jpg';
export const MODEL_IMAGE = '/src/assets/images/color_studio_sintra_1795365610011.jpg';

const IMG_CAT_STONE = '/assets/aistudio/image_24aab1ca.png';
const IMG_CAT_WOOD = '/assets/aistudio/image_f7f5a308.png';
const IMG_CAT_STEEL = '/assets/aistudio/image_12ed1e67.png';
const IMG_CAT_MEDIA = '/assets/aistudio/image_e7ea2586.png';

const IMG_HERO = '/src/assets/images/color_hero_oak_stone_1795365610296.jpg';
const IMG_LIVROS = '/src/assets/images/color_work_livros_1795365610125.jpg';
const IMG_BOSQUE = '/src/assets/images/color_work_bosque_1795365610346.jpg';
const IMG_ABRIGO = '/src/assets/images/color_work_abrigo_1795365610641.jpg';
const IMG_TRILOGIA = '/src/assets/images/color_work_trilogia_1795365610557.jpg';
const IMG_WORKBENCH = '/src/assets/images/color_practice_studio_1795365610802.jpg';
const IMG_SINTRA = '/src/assets/images/color_studio_sintra_1795365610011.jpg';

export const PORTFOLIO_CATEGORIES: PortfolioCategoryItem[] = [
  {
    id: 'STONE',
    code: '01',
    title: 'Stone',
    categoryLine: 'SCULPTURE · MONOLITHS & PUBLIC STONEWORK',
    metaLine: 'ARCHAIC FORM · GRAVITY · PLACE',
    image: IMG_CAT_STONE,
  },
  {
    id: 'WOOD',
    code: '02',
    title: 'Wood',
    categoryLine: 'OAK TIMBER · TRUNKS & CARVED VOLUMES',
    metaLine: 'TERRITORIAL MATERIAL · INCISION',
    image: IMG_CAT_WOOD,
  },
  {
    id: 'STEEL',
    code: '03',
    title: 'Steel',
    categoryLine: 'FOLDED PLANES · STRUCTURAL SCULPTURE',
    metaLine: 'GEOMETRIC TENSION · OPEN SPACE',
    image: IMG_CAT_STEEL,
  },
  {
    id: 'MEDIA / INSTALLATION',
    code: '04',
    title: 'Media / Installation',
    categoryLine: 'SPATIAL INSTALLATION · INTERACTIVE MEDIA',
    metaLine: 'SCULPTURE · PERFORMANCE · SOUND',
    image: IMG_CAT_MEDIA,
  },
];

export const ELEVATOR_FLOORS: FloorItem[] = [
  {
    id: 'index',
    code: '30',
    label: 'INDEX',
    elevation: '+120.00',
    sectionEyebrow: 'SCULPTOR · NEW MEDIA ARTIST',
    theme: 'light',
  },
  {
    id: 'projects',
    code: '24',
    label: 'PROJECTS',
    elevation: '+96.00',
    sectionEyebrow: 'SELECTED WORKS',
    theme: 'light',
  },
  {
    id: 'practice',
    code: 'M',
    label: 'PRACTICE',
    elevation: '+4.20',
    sectionEyebrow: 'AREAS OF PRACTICE',
    theme: 'light',
  },
  {
    id: 'studio',
    code: '00',
    label: 'STUDIO',
    elevation: '±0.00',
    sectionEyebrow: 'BIOGRAPHY & STUDIO',
    theme: 'dark',
  },
  {
    id: 'journal',
    code: 'B1',
    label: 'JOURNAL',
    elevation: '-3.60',
    sectionEyebrow: 'EXHIBITIONS & PUBLICATIONS',
    theme: 'light',
  },
  {
    id: 'contact',
    code: 'B2',
    label: 'CONTACT',
    elevation: '-7.20',
    sectionEyebrow: 'CONTACT & REPRESENTATION',
    theme: 'light',
  },
];

export const HERO_ELEVATION_TICKS = [
  '+120.00',
  '+100.00',
  '+80.00',
  '+60.00',
  '+40.00',
  '+20.00',
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'livros',
    floor: '01',
    title: 'Livros',
    location: 'PORTUGAL',
    year: '2021',
    typology: 'SCULPTURE',
    portfolioCategory: 'WOOD',
    categoryLine: 'SCULPTURE · TERRITORIAL MATERIALITY',
    medium: 'OAK WOOD · SCULPTURE',
    context: 'ZET GALLERY / 1986–2021',
    lead: 'Minimalist sculptural volumes shaped as books. Raw timber and quiet incision treat material as a lasting record of place and time.',
    image: IMG_CAT_WOOD,
    gallery: [IMG_CAT_WOOD, IMG_LIVROS, IMG_WORKBENCH],
    steps: [
      {
        label: 'Material',
        text: 'Shaped from solid timber blocks bound to the territory, preserving natural grain, fissures and surface weight.',
      },
      {
        label: 'Form',
        text: 'Reduced to open and closed book geometries where minimal cuts establish rhythm without ornamental gesture.',
      },
      {
        label: 'Context',
        text: 'Created in 2021 and documented within the retrospective monograph covering Volker Schnüttgen’s work from 1986 to 2021.',
      },
    ],
    featured: true,
  },
  {
    id: 'o-bosque-trindade',
    floor: '02',
    title: 'O Bosque (Trindade)',
    location: 'PORTUGAL',
    year: '2019',
    typology: 'INSTALLATION',
    portfolioCategory: 'MEDIA / INSTALLATION',
    categoryLine: 'SCULPTURE & SPATIAL INSTALLATION',
    medium: 'OAK TIMBER · INSTALLATION',
    context: 'SPATIAL EXHIBITION · 2019',
    lead: 'A field of vertical oak monoliths arranged across the room. The installation marks space as a discoverable forest of signs.',
    image: IMG_BOSQUE,
    gallery: [IMG_BOSQUE, IMG_HERO, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Vertical oak elements worked with restrained tool marks so raw timber density remains legible at full body scale.',
      },
      {
        label: 'Form',
        text: 'Spaced like standing trunks or megalithic markers, establishing a pattern that turns floor area into symbolic territory.',
      },
      {
        label: 'Context',
        text: 'Realised in 2019 as part of Schnüttgen’s spatial research connecting ancestral forest imagery with contemporary gallery architecture.',
      },
    ],
    featured: true,
  },
  {
    id: 'abrigo-i-e-ii',
    floor: '03',
    title: 'Abrigo I e II',
    location: 'PORTUGAL',
    year: '2019',
    typology: 'SCULPTURE',
    portfolioCategory: 'STONE',
    categoryLine: 'SCULPTURE · ARCHITECTONIC FORM',
    medium: 'STONE & OAK · SCULPTURE',
    context: 'PAIRED WORKS · 2019',
    lead: 'Two paired sculptures examining shelter and threshold. Heavy stone and timber meet in forms recalling archaic dolmens.',
    image: IMG_CAT_STONE,
    gallery: [IMG_CAT_STONE, IMG_ABRIGO, IMG_WORKBENCH],
    steps: [
      {
        label: 'Material',
        text: 'Combines rough-hewn stone mass and solid timber beams anchored purely through gravity, bearing and balance.',
      },
      {
        label: 'Form',
        text: 'Draws directly on the semiotic clarity of megalithic dolmens—creating an interior shadow and a quiet spatial refuge.',
      },
      {
        label: 'Context',
        text: 'Completed in 2019 as two companion structures extending the artist’s enquiry into dwelling, protection and place.',
      },
    ],
    featured: true,
  },
  {
    id: 'trilogia-de-um-carvalho',
    floor: '04',
    title: 'Trilogia de um Carvalho',
    location: 'SINTRA, PT',
    year: '2011',
    typology: 'SCULPTURE',
    portfolioCategory: 'WOOD',
    categoryLine: 'SCULPTURE · OAK WOOD',
    medium: 'CARVED OAK TRUNKS',
    context: 'SINTRA STUDIO · 2011',
    lead: 'Three monumental oak forms carved from tree trunks. Each volume registers growth, weight and deliberate geometric intervention.',
    image: IMG_TRILOGIA,
    gallery: [IMG_TRILOGIA, IMG_CAT_WOOD, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Massive oak timber sourced from the local territory, respecting knots, radial splits and weathered surface patina.',
      },
      {
        label: 'Form',
        text: 'Arranged as a three-part sequence where subtle cuts and planar facets set up a dialogue across the ground.',
      },
      {
        label: 'Context',
        text: 'Produced in 2011 in Sintra, marking a pivotal work in Volker Schnüttgen’s long study of oak as a sculptural medium.',
      },
    ],
    featured: true,
  },
  {
    id: 'habitat',
    floor: '05',
    title: 'Habitat',
    location: 'BERLIN, DE · RADIALSYSTEM V',
    year: '2010',
    typology: 'INSTALLATION',
    portfolioCategory: 'MEDIA / INSTALLATION',
    categoryLine: 'INSTALLATION · OAK SCULPTURES, DANCE & SOUND',
    medium: 'OAK SCULPTURE · INTERACTIVE MEDIA',
    context: 'LABORGRAS · RADIALSYSTEM V',
    lead: 'A walkable oak installation uniting sculpture, choreography and live sound. Conceived in co-production with dance collective LaborGras.',
    image: IMG_CAT_MEDIA,
    gallery: [IMG_CAT_MEDIA, IMG_BOSQUE, IMG_ABRIGO],
    steps: [
      {
        label: 'Material',
        text: 'Oak sculptural architecture paired with interactive media systems by Frieder Weiss and a soundscape by Giorgio de Santis.',
      },
      {
        label: 'Form',
        text: 'Functions simultaneously as sculpture, performance stage and shared spatial habitat traversed by dancer and audience.',
      },
      {
        label: 'Context',
        text: 'Premiered at Radialsystem V, Berlin, in 2010 with support from the Capital Berlin Cultural Fund.',
      },
    ],
    featured: true,
  },
  {
    id: 'espacos-virtuais',
    floor: '06',
    title: 'Espaços Virtuais I–VIII',
    location: 'PORTO / SINTRA',
    year: '2008',
    typology: 'SERIES',
    portfolioCategory: 'MEDIA / INSTALLATION',
    categoryLine: 'SERIES · MEDIA ART & SPATIAL STUDY',
    medium: 'NEW MEDIA · SPATIAL SERIES',
    context: 'FBAUP MEDIA ART · 2008',
    lead: 'An eight-part series bridging physical sculptural perception and virtual spatial environments.',
    image: IMG_SINTRA,
    gallery: [IMG_SINTRA, IMG_CAT_MEDIA, IMG_BOSQUE],
    steps: [
      {
        label: 'Material',
        text: 'Digital spatial studies informed by the artist’s 2004 new technologies training in Berlin under a Calouste Gulbenkian Foundation scholarship.',
      },
      {
        label: 'Form',
        text: 'Articulated across eight sequential studies examining boundary, light and virtual depth.',
      },
      {
        label: 'Context',
        text: 'Developed in 2008 alongside his Master Degree in Media Art at FBAUP, Porto.',
      },
    ],
    featured: false,
  },
  {
    id: 'pieta',
    floor: '07',
    title: 'Pietá',
    location: 'SINTRA, PT',
    year: '2007',
    typology: 'SCULPTURE',
    portfolioCategory: 'STONE',
    categoryLine: 'SCULPTURE · ARCHAIC FIGURATION',
    medium: 'SCULPTURE',
    context: 'SINGLE WORK · 2007',
    lead: 'Archaic figuration condensed into quiet sculptural mass. Ancient gesture translated into minimalist contemporary form.',
    image: IMG_HERO,
    gallery: [IMG_HERO, IMG_WORKBENCH, IMG_ABRIGO],
    steps: [
      {
        label: 'Material',
        text: 'Carved from solid sculptural mass with strict attention to surface transitions and edge tension.',
      },
      {
        label: 'Form',
        text: 'Traces a path from archaic figurative memory toward spare geometric abstraction.',
      },
      {
        label: 'Context',
        text: 'Created in 2007 during Volker Schnüttgen’s Sintra studio period.',
      },
    ],
    featured: false,
  },
  {
    id: 'quadrado-negro',
    floor: '08',
    title: 'Quadrado Negro',
    location: 'SINTRA, PT',
    year: '2007',
    typology: 'SCULPTURE',
    portfolioCategory: 'STONE',
    categoryLine: 'SCULPTURE · GEOMETRIC REDUCTION',
    medium: 'SCULPTURE',
    context: 'SINGLE WORK · 2007',
    lead: 'A stark geometric sign anchored in space. Minimalist volume reduced to pure weight and contour.',
    image: IMG_ABRIGO,
    gallery: [IMG_ABRIGO, IMG_CAT_STONE, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Darkened surface and dense sculptural body emphasizing mass over descriptive detail.',
      },
      {
        label: 'Form',
        text: 'Operates as a visual marker and spatial anchor within the exhibition room.',
      },
      {
        label: 'Context',
        text: 'Completed in 2007 as part of Schnüttgen’s reductive geometric investigations.',
      },
    ],
    featured: false,
  },
  {
    id: 'alfabeto-escultorico',
    floor: '09',
    title: 'Alfabeto Escultórico',
    location: 'SINTRA, PT',
    year: '2006',
    typology: 'SERIES',
    portfolioCategory: 'STEEL',
    categoryLine: 'SERIES · SEMIOTIC SCULPTURE',
    medium: 'SCULPTURE SERIES',
    context: 'SEMIOTIC SERIES · 2006',
    lead: 'Sculpture articulated as a grammar of signs. Individual forms combine like characters in an ancestral script.',
    image: IMG_SINTRA,
    gallery: [IMG_SINTRA, IMG_CAT_STEEL, IMG_BOSQUE],
    steps: [
      {
        label: 'Material',
        text: 'Series of tactile studies executed in natural and structural sculptural materials.',
      },
      {
        label: 'Form',
        text: 'Each piece acts as a distinct typographic unit within a discoverable spatial vocabulary.',
      },
      {
        label: 'Context',
        text: 'Produced in 2006, embodying his view of sculpture as a pattern that establishes a sign.',
      },
    ],
    featured: false,
  },
  {
    id: 'para-florbela-espanca',
    floor: '10',
    title: 'Para Florbela Espanca',
    location: 'PORTUGAL',
    year: '1998',
    typology: 'SCULPTURE',
    portfolioCategory: 'WOOD',
    categoryLine: 'SCULPTURE · TRIBUTE WORK',
    medium: 'SCULPTURE',
    context: 'PORTUGAL · 1998',
    lead: 'A sculptural tribute dedicated to Portuguese poet Florbela Espanca. Poetic restraint held in silent material form.',
    image: IMG_LIVROS,
    gallery: [IMG_LIVROS, IMG_TRILOGIA, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Worked with careful manual discipline grounded in stone and wood traditions.',
      },
      {
        label: 'Form',
        text: 'Minimalist silhouette creating a contemplative space of memory and homage.',
      },
      {
        label: 'Context',
        text: 'Realised in 1998 during the artist’s early years living permanently in Sintra.',
      },
    ],
    featured: false,
  },
  {
    id: 'satzzeichen',
    floor: '11',
    title: 'Satzzeichen I–V',
    location: 'PORTUGAL / GERMANY',
    year: '1997',
    typology: 'SERIES',
    portfolioCategory: 'STEEL',
    categoryLine: 'SERIES · FIVE-PART SCULPTURAL WORK',
    medium: 'FIVE-PART SCULPTURE SERIES',
    context: 'SERIES · 1997',
    lead: 'Five sculptural punctuation marks placed in dialogue with architecture. Each work introduces pause and cadence.',
    image: IMG_CAT_STEEL,
    gallery: [IMG_CAT_STEEL, IMG_SINTRA, IMG_HERO],
    steps: [
      {
        label: 'Material',
        text: 'Five physical elements crafted with crisp edges and tactile surface contrast.',
      },
      {
        label: 'Form',
        text: 'Acts literally as spatial punctuation—dividing, slowing and framing movement across the room.',
      },
      {
        label: 'Context',
        text: 'Completed in 1997 between German structural rigour and Portuguese studio practice.',
      },
    ],
    featured: false,
  },
  {
    id: 'jogo-fatal',
    floor: '12',
    title: 'Jogo Fatal I e II',
    location: 'PORTUGAL',
    year: '1995 / 1997',
    typology: 'SCULPTURE',
    portfolioCategory: 'STEEL',
    categoryLine: 'SCULPTURE · TWO-PART WORK',
    medium: 'SCULPTURE',
    context: 'TWO-PART CYCLE · 1995–1997',
    lead: 'A two-part sculptural cycle developed between 1995 and 1997. Opposing volumes hold physical tension in balance.',
    image: IMG_WORKBENCH,
    gallery: [IMG_WORKBENCH, IMG_CAT_STEEL, IMG_ABRIGO],
    steps: [
      {
        label: 'Material',
        text: 'Dense materials shaped to reveal structural stress and counter-weight.',
      },
      {
        label: 'Form',
        text: 'Two paired statements testing equilibrium, fracture and spatial confrontation.',
      },
      {
        label: 'Context',
        text: 'Produced across 1995 and 1997 following his permanent relocation to Portugal.',
      },
    ],
    featured: false,
  },
  {
    id: 'memoria-de-lisboa',
    floor: '13',
    title: 'Memória de Lisboa',
    location: 'LISBON / SINTRA, PT',
    year: '1995',
    typology: 'SCULPTURE',
    portfolioCategory: 'STONE',
    categoryLine: 'SCULPTURE · TERRITORIAL MEMORY',
    medium: 'SCULPTURE',
    context: 'PORTUGAL · 1995',
    lead: 'An early sculptural response to Lisbon’s light, stone and urban horizon, created two years after settling in Sintra.',
    image: IMG_ABRIGO,
    gallery: [IMG_ABRIGO, IMG_CAT_STONE, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Grounded in raw stone and mineral permanence reflecting Lisbon’s limestone and granite fabric.',
      },
      {
        label: 'Form',
        text: 'Compact architectural memory compressed into minimal sculptural planes.',
      },
      {
        label: 'Context',
        text: 'Created in 1995 after arriving in Portugal on a grant from the Portuguese Ministry of Foreign Affairs.',
      },
    ],
    featured: false,
  },
  {
    id: 'der-steinsetzer',
    floor: '14',
    title: 'Der Steinsetzer',
    location: 'GERMANY',
    year: '1989',
    typology: 'SCULPTURE',
    portfolioCategory: 'STONE',
    categoryLine: 'SCULPTURE · STONEWORK',
    medium: 'STONE SCULPTURE',
    context: 'EARLY WORK · 1989',
    lead: 'An early stonework piece from Germany. Grounded weight and hand-dressed stone establish the foundation of his later language.',
    image: IMG_WORKBENCH,
    gallery: [IMG_WORKBENCH, IMG_CAT_STONE, IMG_ABRIGO],
    steps: [
      {
        label: 'Material',
        text: 'Carved stone shaped directly by chisel, hammer and hand placement.',
      },
      {
        label: 'Form',
        text: 'Anchors the act of setting stone—marking ground, gravity and human measure.',
      },
      {
        label: 'Context',
        text: 'Executed in 1989 following his studies in sculpture and engraving at the Bremen University of Arts.',
      },
    ],
    featured: false,
  },
  {
    id: 'monumento-arvore-desconhecida',
    floor: '15',
    title: 'Monumento para uma Árvore Desconhecida',
    location: 'PORTUGAL',
    year: 'ARCHIVE',
    typology: 'SITE & PUBLIC',
    portfolioCategory: 'WOOD',
    categoryLine: 'SCULPTURE · TERRITORIAL MARKER',
    medium: 'WOOD & STONE · SCULPTURE',
    context: 'TERRITORIAL WORK',
    lead: 'A quiet monument dedicated to an unknown tree. Sculpture becomes an ethical marker honoring natural presence in the landscape.',
    image: IMG_TRILOGIA,
    gallery: [IMG_TRILOGIA, IMG_CAT_WOOD, IMG_SINTRA],
    steps: [
      {
        label: 'Material',
        text: 'Organic timber and territorial stone brought together without artifice.',
      },
      {
        label: 'Form',
        text: 'Minimalist vertical marker creating an intimate site of pause and recognition.',
      },
      {
        label: 'Context',
        text: 'Reflects Volker Schnüttgen’s recurring dialogue with arboreal memory and ecological awareness.',
      },
    ],
    featured: false,
  },
  {
    id: 'rosa-dos-ventos',
    floor: '16',
    title: 'Rosa dos Ventos',
    location: 'ALDEIA DO PONTIDO, FAFE',
    year: 'RESIDENCY',
    typology: 'SITE & PUBLIC',
    portfolioCategory: 'STONE',
    categoryLine: 'SITE SCULPTURE · ARTISTIC RESIDENCY',
    medium: 'SITE-SPECIFIC SCULPTURE',
    context: 'ALDEIA DO PONTIDO, FAFE',
    lead: 'Site sculpture created during an artistic residency in Aldeia do Pontido, Fafe, orienting cardinal direction within the terrain.',
    image: IMG_HERO,
    gallery: [IMG_HERO, IMG_TRILOGIA, IMG_ABRIGO],
    steps: [
      {
        label: 'Material',
        text: 'Built with durable natural materials suited to exposed rural topography in northern Portugal.',
      },
      {
        label: 'Form',
        text: 'Translates cardinal orientation into an accessible, discoverable sculptural sign.',
      },
      {
        label: 'Context',
        text: 'Resulting directly from the artist’s site residency in Aldeia do Pontido, Fafe.',
      },
    ],
    featured: false,
  },
  {
    id: 'common-home',
    floor: '17',
    title: 'Common Home',
    location: 'GUIMARÃES, PT · UMINHO',
    year: 'PUBLIC',
    typology: 'SITE & PUBLIC',
    portfolioCategory: 'STONE',
    categoryLine: 'PUBLIC WORK · UNIVERSIDADE DO MINHO',
    medium: 'PUBLIC SCULPTURE',
    context: 'CAMPUS DE AZURÉM, GUIMARÃES',
    lead: 'Permanent public work at the Campus de Azurém of Universidade do Minho. An archetypal shelter marking shared civic ground.',
    image: IMG_ABRIGO,
    gallery: [IMG_ABRIGO, IMG_CAT_STONE, IMG_BOSQUE],
    steps: [
      {
        label: 'Material',
        text: 'Monumental natural stone and structural timber proportioned for permanent outdoor campus siting.',
      },
      {
        label: 'Form',
        text: 'Evokes an open threshold and ancestral house—a symbolic meeting place open to all.',
      },
      {
        label: 'Context',
        text: 'Installed at Universidade do Minho, Campus de Azurém, Guimarães.',
      },
    ],
    featured: false,
  },
];

export const PRACTICE_DISCIPLINES: DisciplineItem[] = [
  {
    id: 'sculpture',
    code: 'M.01',
    title: 'Sculpture',
    description:
      'Works shaped primarily in oak and stone tied to territory. Minimalist in form and attentive to detail, each sculpture establishes a sign, marks place, and opens a symbolic space rooted in archaic figuration and dolmen geometry.',
    tags: ['OAK WOOD', 'STONE', 'ARCHAIC FORM', 'SYMBOLIC SPACE'],
  },
  {
    id: 'installation',
    code: 'M.02',
    title: 'Installation',
    description:
      'Spatial ensembles where sculptural volumes structure an entire room or landscape, inviting discovery through scale, proportion, and quiet formal tension.',
    tags: ['SPATIAL DESIGN', 'SITE MARKING', 'PROPORTION', 'HABITAT'],
  },
  {
    id: 'performance',
    code: 'M.03',
    title: 'Performance & Collaboration',
    description:
      'Cross-disciplinary productions uniting sculpture with choreography and sound—exemplified by Habitat (2010), co-produced with dance collective LaborGras at Radialsystem V, Berlin.',
    tags: ['LABORGRAS', 'DANCE', 'SOUNDSCAPE', 'RADIALSYSTEM V'],
  },
  {
    id: 'engraving',
    code: 'M.04',
    title: 'Engraving',
    description:
      'Grounded in his studies of sculpture and engraving begun in 1982 at the Bremen University of Arts, carrying precision of line, incision, and surface discipline.',
    tags: ['BREMEN 1982', 'INCISION', 'SURFACE', 'PRINTMAKING'],
  },
  {
    id: 'new-media',
    code: 'M.05',
    title: 'New Media',
    description:
      'Interactive systems and time-based works informed by his 2004 Calouste Gulbenkian Foundation scholarship in Berlin and his 2008 Master Degree in Media Art at FBAUP.',
    tags: ['MEDIA ART', 'FBAUP 2008', 'BERLIN 2004', 'INTERACTIVE'],
  },
];

export const STUDIO_STATS: StudioStat[] = [
  { value: '1961', label: 'BORN IN ATTENDORN, GERMANY' },
  { value: '1993', label: 'LIVING & WORKING IN SINTRA' },
  { value: '2010–16', label: 'SCULPTURE PROFESSOR AT FBAUP' },
  { value: '1986', label: 'EXHIBITIONS & CONTESTS SINCE' },
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'geography-of-mysteries',
    date: 'CENTRO CULTURAL DE CASCAIS',
    category: 'EXHIBITION',
    title: 'A Geography of Mysteries — Centro Cultural de Cascais',
    subtitle:
      'Curated by Helena Mendes Pereira (zet gallery). Organized across four distinct spaces corresponding to dedicated series of works by Volker Schnüttgen.',
    image: IMG_BOSQUE,
    creditLabel: 'CURATED BY',
    creditValue: 'HELENA MENDES PEREIRA (ZET GALLERY)',
    secondaryLabel: 'VENUE',
    secondaryValue: 'CENTRO CULTURAL DE CASCAIS',
    introParagraphs: [
      'Presented at Centro Cultural de Cascais under the curation of Helena Mendes Pereira (zet gallery), A Geography of Mysteries unfolds across four distinct architectural spaces, each anchored by a dedicated series of sculptures and spatial installations.',
      'Working primarily with oak timber and stone linked directly to territory, Volker Schnüttgen approaches sculpture as a system of signs that articulates space rather than filling it. Each room establishes its own cadence of mass, interval, and silence.',
    ],
    largeHeading: 'Four spaces, one spatial grammar',
    largeHeadingText:
      'Across the four rooms of the exhibition, works in carved oak and dressed stone draw on archaic forms and the enduring geometry of megalithic dolmens—inviting visitors to move through each series as a discoverable territory.',
    subHeading: 'Material bound to place',
    subHeadingText:
      'Minimalist in form and deeply attentive to surface detail, the pieces register raw timber grain, radial fissures, and chisel marks—turning physical material into quiet memory.',
    details: [
      'Presented at Centro Cultural de Cascais under the curation of Helena Mendes Pereira (zet gallery).',
      'Organized across four distinct spaces corresponding to dedicated series of works by Volker Schnüttgen.',
    ],
    featured: true,
  },
  {
    id: 'dialogues-universonauta',
    date: 'CURATORIAL EXERCISE',
    category: 'EXHIBITION',
    title: 'Dialogue(s) with a Universonauta — Volker Schnüttgen & Domingos Loureiro',
    subtitle:
      'A curatorial exercise conceived by Helena Mendes Pereira bringing together works by Volker Schnüttgen and Domingos Loureiro.',
    image: IMG_SINTRA,
    creditLabel: 'CURATED BY',
    creditValue: 'HELENA MENDES PEREIRA',
    secondaryLabel: 'ARTISTS',
    secondaryValue: 'VOLKER SCHNÜTTGEN · DOMINGOS LOUREIRO',
    introParagraphs: [
      'Conceived as a curatorial exercise by Helena Mendes Pereira, Dialogue(s) with a Universonauta places Volker Schnüttgen’s sculptural vocabulary into direct conversation with the work of Domingos Loureiro.',
      'Rather than framing each artist in isolation, the exhibition traces shared questions of gesture, surface tension, and how material presence constructs an open symbolic space between viewer and work.',
    ],
    largeHeading: 'Constructing a shared dialogue',
    largeHeadingText:
      'Placed side by side, Schnüttgen’s grounded volumes in wood and stone enter into counterpoint with Loureiro’s pictorial and spatial inquiries—revealing unexpected resonances of scale, rhythm, and restraint.',
    subHeading: 'Form as pattern and sign',
    subHeadingText:
      'Informed by decades of dialogue between sculpture, engraving, and media art across Germany and Portugal, the exhibition foregrounds art as an ongoing encounter rather than a closed statement.',
    details: [
      'A curatorial exercise conceived by Helena Mendes Pereira bringing together works by Volker Schnüttgen and Domingos Loureiro.',
    ],
    featured: true,
  },
  {
    id: 'monograph-1986-2021',
    date: '1986–2021',
    category: 'PUBLICATION',
    title: 'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021)',
    subtitle:
      'Comprehensive monograph with critical essays by Gisela Rosenthal and contributing authors, documenting thirty-five years of sculptural and spatial work.',
    image: IMG_CAT_WOOD,
    creditLabel: 'TEXTS BY',
    creditValue: 'GISELA ROSENTHAL & AUTHORS',
    secondaryLabel: 'ARCHIVE PERIOD',
    secondaryValue: '1986 — 2021',
    introParagraphs: [
      'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021) gathers thirty-five years of sculpture, public installations, collaborative performances, and new media investigations into a single critical volume.',
      'Opening with his early training in sculpture and engraving at the Bremen University of Arts (1982) and early German stonework such as Der Steinsetzer (1989), the monograph traces his permanent relocation to Sintra in 1993.',
    ],
    largeHeading: 'Between Sintra, Porto and Berlin',
    largeHeadingText:
      'Alongside documented outdoor monoliths and wood works, the publication examines pivotal cross-disciplinary milestones—including his Calouste Gulbenkian Foundation scholarship in Berlin (2004), his Master Degree in Media Art at FBAUP (2008), and the Berlin Radialsystem V co-production Habitat (2010).',
    subHeading: 'Thirty-five years of technical-poetic practice',
    subHeadingText:
      'Bringing the archive forward through recent works such as Abrigo I e II (2019), O Bosque (Trindade) (2019), and Livros (2021), the essays by Gisela Rosenthal and contributing authors frame Schnüttgen’s enduring inquiry into matter, memory, and place.',
    details: [
      'Comprehensive publication documenting Volker Schnüttgen’s sculptural and technical-poetic body of work between 1986 and 2021.',
      'Includes critical essays by Gisela Rosenthal and contributing authors.',
    ],
    featured: true,
  },
];
