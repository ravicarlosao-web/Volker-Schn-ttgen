import type {
  FloorItem,
  JournalEntry,
  PortfolioCategoryId,
  PortfolioCategoryItem,
  StudioStat,
} from '../data/formtectureData';
import type { Language } from './LanguageContext';

export interface UIStrings {
  sidebar: {
    ariaNav: string;
    ariaHome: string;
    elevation: string;
    floors: Record<FloorItem['id'], string>;
  };
  hero: {
    role: string;
    origin: string;
  };
  portfolio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    allWorksBtn: string;
    catalogueEyebrow: string;
    catalogueSubtitle: string;
    filters: Record<string, string>;
    categories: Record<
      string,
      { title: string; categoryLine: string; metaLine: string }
    >;
  };
  projectDetail: {
    location: string;
    year: string;
    typology: string;
    medium: string;
    context: string;
    sectionLabel: string;
    approachLabel: string;
    approachHeading: string;
    approachSubtitle: string;
    nextWork: string;
    allWorks: string;
    typologyValues: Record<'SCULPTURE' | 'INSTALLATION' | 'SITE & PUBLIC' | 'SERIES', string>;
  };
  practice: {
    eyebrow: string;
    title: string;
    subtitle: string;
    disciplines: Record<
      string,
      { title: string; description: string; tags: string[] }
    >;
  };
  studio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    bio: string;
    groundFloor: string;
    caption: string;
    openShuttersAria: string;
    closeShuttersAria: string;
    statLabels: string[];
  };
  journal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    allEntriesBtn: string;
    nextEntry: string;
    allEntriesLink: string;
    categories: Record<JournalEntry['category'], string>;
    entries: Record<
      string,
      {
        date: string;
        title: string;
        subtitle: string;
        creditLabel: string;
        creditValue: string;
        secondaryLabel: string;
        secondaryValue: string;
        introParagraphs: string[];
        largeHeading: string;
        largeHeadingText: string;
        subHeading: string;
        subHeadingText: string;
      }
    >;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      orgLabel: string;
      orgPlaceholder: string;
      locationLabel: string;
      locationPlaceholder: string;
      subjectLabel: string;
      subjectOptions: string[];
      scopeLabel: string;
      scopeOptions: string[];
      messageLabel: string;
      messagePlaceholder: string;
      submitBtn: string;
      confirmedTitle: string;
      confirmedBody: (name: string, subject: string) => string;
      newEnquiryBtn: string;
    };
    directContact: string;
    copiedLabel: string;
    studioLabel: string;
    representationLabel: string;
    representationRole: string;
    privacy: string;
    adminPortal: string;
    copyright: string;
  };
  modals: {
    close: string;
    archiveEyebrow: string;
    archiveTitle: string;
    archiveSubtitle: string;
    recordsCount: (n: number) => string;
    filterAll: string;
    filterExhibition: string;
    filterPublication: string;
    enquiryDialogTitle: string;
    enquiryEyebrow: string;
    enquiryTitle: string;
    enquiryMeta: string;
    enquiryPreparedTitle: string;
    enquiryPreparedBody: (name: string, subject: string) => string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectOptions: string[];
    messageLabel: string;
    messagePlaceholder: string;
    studioNote: string;
    sendBtn: string;
    privacyTitle: string;
    privacyEyebrow: string;
    privacyBody1: string;
    privacyBody2: string;
    privacyMeta: string;
  };
}

export const UI_TRANSLATIONS: Record<Language, UIStrings> = {
  en: {
    sidebar: {
      ariaNav: 'Portfolio section navigation',
      ariaHome: 'Volker Schnüttgen — Return to Index',
      elevation: 'ELEVATION',
      floors: {
        index: 'INDEX',
        projects: 'PROJECTS',
        practice: 'PRACTICE',
        studio: 'STUDIO',
        journal: 'JOURNAL',
        contact: 'CONTACT',
      },
    },
    hero: {
      role: 'SCULPTOR · NEW MEDIA ARTIST',
      origin: 'ATTENDORN, 1961 / SINTRA, PORTUGAL',
    },
    portfolio: {
      eyebrow: 'INDEX 01–04 — PORTFOLIO',
      title: 'Portfolio',
      subtitle:
        'Four categories across stone, wood, steel and new media. Select a medium to browse works.',
      allWorksBtn: 'ALL WORKS',
      catalogueEyebrow: 'PORTFOLIO 01–17 — WORKS',
      catalogueSubtitle:
        'Works across stone, oak wood, steel and media installation. Select any work to open its full record.',
      filters: {
        ALL: 'ALL',
        STONE: 'STONE',
        WOOD: 'WOOD',
        STEEL: 'STEEL',
        'MEDIA / INSTALLATION': 'MEDIA / INSTALLATION',
      },
      categories: {
        STONE: {
          title: 'Stone',
          categoryLine: 'SCULPTURE · MONOLITHS & PUBLIC STONEWORK',
          metaLine: 'ARCHAIC FORM · GRAVITY · PLACE',
        },
        WOOD: {
          title: 'Wood',
          categoryLine: 'OAK TIMBER · TRUNKS & CARVED VOLUMES',
          metaLine: 'TERRITORIAL MATERIAL · INCISION',
        },
        STEEL: {
          title: 'Steel',
          categoryLine: 'FOLDED PLANES · STRUCTURAL SCULPTURE',
          metaLine: 'GEOMETRIC TENSION · OPEN SPACE',
        },
        'MEDIA / INSTALLATION': {
          title: 'Media / Installation',
          categoryLine: 'SPATIAL INSTALLATION · INTERACTIVE MEDIA',
          metaLine: 'SCULPTURE · PERFORMANCE · SOUND',
        },
      },
    },
    projectDetail: {
      location: 'LOCATION',
      year: 'YEAR',
      typology: 'TYPOLOGY',
      medium: 'MEDIUM',
      context: 'CONTEXT',
      sectionLabel: 'SECTION A–A',
      approachLabel: 'APPROACH',
      approachHeading: 'Material, form, space',
      approachSubtitle: 'How the work is structured, in three notes.',
      nextWork: 'Next work',
      allWorks: 'All works',
      typologyValues: {
        SCULPTURE: 'SCULPTURE',
        INSTALLATION: 'INSTALLATION',
        'SITE & PUBLIC': 'SITE & PUBLIC',
        SERIES: 'SERIES',
      },
    },
    practice: {
      eyebrow: 'FLOOR M — PRACTICE',
      title: 'Practice',
      subtitle:
        'Sculpture, installation, performance, engraving and new media across territory and space.',
      disciplines: {
        sculpture: {
          title: 'Sculpture',
          description:
            'Works shaped primarily in oak and stone tied to territory. Minimalist in form and attentive to detail, each sculpture establishes a sign, marks place, and opens a symbolic space rooted in archaic figuration and dolmen geometry.',
          tags: ['OAK WOOD', 'STONE', 'ARCHAIC FORM', 'SYMBOLIC SPACE'],
        },
        installation: {
          title: 'Installation',
          description:
            'Spatial ensembles where sculptural volumes structure an entire room or landscape, inviting discovery through scale, proportion, and quiet formal tension.',
          tags: ['SPATIAL DESIGN', 'SITE MARKING', 'PROPORTION', 'HABITAT'],
        },
        performance: {
          title: 'Performance & Collaboration',
          description:
            'Cross-disciplinary productions uniting sculpture with choreography and sound—exemplified by Habitat (2010), co-produced with dance collective LaborGras at Radialsystem V, Berlin.',
          tags: ['LABORGRAS', 'DANCE', 'SOUNDSCAPE', 'RADIALSYSTEM V'],
        },
        engraving: {
          title: 'Engraving',
          description:
            'Grounded in his studies of sculpture and engraving begun in 1982 at the Bremen University of Arts, carrying precision of line, incision, and surface discipline.',
          tags: ['BREMEN 1982', 'INCISION', 'SURFACE', 'PRINTMAKING'],
        },
        'new-media': {
          title: 'New Media',
          description:
            'Interactive systems and time-based works informed by his 2004 Calouste Gulbenkian Foundation scholarship in Berlin and his 2008 Master Degree in Media Art at FBAUP.',
          tags: ['MEDIA ART', 'FBAUP 2008', 'BERLIN 2004', 'INTERACTIVE'],
        },
      },
    },
    studio: {
      eyebrow: 'FLOOR 00 — BIOGRAPHY',
      title: 'Biography',
      subtitle: 'Sintra, Portugal since 1993. Represented by zet gallery.',
      bio: 'Born in Attendorn, Germany, in 1961, Volker Schnüttgen began studying sculpture and engraving at the Bremen University of Arts in 1982 and completed his Master Degree in Media Art at FBAUP in 2008. Recipient of a Portuguese Ministry of Foreign Affairs grant (1992), the Culture Award from the Council of Olpe (1999), a Calouste Gulbenkian Foundation scholarship in Berlin (2004) and the Capital Berlin Cultural Fund (2010), he lives and works permanently in Sintra since 1993.',
      groundFloor: 'GROUND FLOOR',
      caption: 'SINTRA STUDIO — SPATIAL STUDY & ARCHIVE',
      openShuttersAria: 'Open studio archive shutters',
      closeShuttersAria: 'Close studio archive shutters',
      statLabels: [
        'BORN IN ATTENDORN, GERMANY',
        'LIVING & WORKING IN SINTRA',
        'SCULPTURE PROFESSOR AT FBAUP',
        'EXHIBITIONS & CONTESTS SINCE',
      ],
    },
    journal: {
      eyebrow: 'FLOOR B1 — EXHIBITIONS & PUBLICATIONS',
      title: 'Exhibitions',
      subtitle: 'Selected curatorial exhibitions, dialogues and monograph publications.',
      allEntriesBtn: 'ALL EXHIBITIONS & BOOKS',
      nextEntry: 'Next entry',
      allEntriesLink: 'All entries',
      categories: {
        EXHIBITION: 'EXHIBITION',
        PUBLICATION: 'PUBLICATION',
      },
      entries: {
        'geography-of-mysteries': {
          date: 'CENTRO CULTURAL DE CASCAIS',
          title: 'A Geography of Mysteries — Centro Cultural de Cascais',
          subtitle:
            'Curated by Helena Mendes Pereira (zet gallery). Organized across four distinct spaces corresponding to dedicated series of works by Volker Schnüttgen.',
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
        },
        'dialogues-universonauta': {
          date: 'CURATORIAL EXERCISE',
          title: 'Dialogue(s) with a Universonauta — Volker Schnüttgen & Domingos Loureiro',
          subtitle:
            'A curatorial exercise conceived by Helena Mendes Pereira bringing together works by Volker Schnüttgen and Domingos Loureiro.',
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
        },
        'monograph-1986-2021': {
          date: '1986–2021',
          title: 'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021)',
          subtitle:
            'Comprehensive monograph with critical essays by Gisela Rosenthal and contributing authors, documenting thirty-five years of sculptural and spatial work.',
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
        },
      },
    },
    contact: {
      eyebrow: 'FLOOR B2 — CONTACT',
      title: 'Contact & Studio',
      subtitle:
        'For exhibition proposals, institutional commissions and curatorial enquiries.',
      form: {
        nameLabel: 'NAME *',
        namePlaceholder: 'Your full name',
        emailLabel: 'EMAIL *',
        emailPlaceholder: 'name@institution.org',
        orgLabel: 'ORGANISATION',
        orgPlaceholder: 'Gallery, museum or institution',
        locationLabel: 'LOCATION',
        locationPlaceholder: 'City, country',
        subjectLabel: 'ENQUIRY SUBJECT',
        subjectOptions: [
          'Exhibition / Curatorial',
          'Public / Site Commission',
          'Gallery & Acquisition (zet gallery)',
          'Publication / Press',
        ],
        scopeLabel: 'CONTEXT',
        scopeOptions: [
          'Not specified yet',
          'Upcoming exhibition',
          'Institutional archive',
          'Studio visit',
        ],
        messageLabel: 'ABOUT YOUR ENQUIRY *',
        messagePlaceholder:
          'Exhibition details, site context, timeline or curatorial notes.',
        submitBtn: 'SEND ENQUIRY',
        confirmedTitle: 'Enquiry prepared',
        confirmedBody: (name, subject) =>
          `Thank you, ${name}. Your ${subject.toLowerCase()} note is ready for the Sintra studio and zet gallery.`,
        newEnquiryBtn: 'NEW ENQUIRY',
      },
      directContact: 'DIRECT CONTACT',
      copiedLabel: 'COPIED',
      studioLabel: 'STUDIO',
      representationLabel: 'REPRESENTATION',
      representationRole: 'Gallery Representation',
      privacy: 'PRIVACY',
      adminPortal: 'ADMIN STUDIO',
      copyright: '© VOLKER SCHNÜTTGEN — SINTRA, PORTUGAL',
    },
    modals: {
      close: 'CLOSE',
      archiveEyebrow: 'FLOOR B1 — EXHIBITIONS & MONOGRAPH',
      archiveTitle: 'Exhibitions & Publications',
      archiveSubtitle: 'Curatorial projects and published monograph documentation.',
      recordsCount: (n) => `${n} RECORDS`,
      filterAll: 'ALL',
      filterExhibition: 'EXHIBITION',
      filterPublication: 'PUBLICATION',
      enquiryDialogTitle: 'Studio Enquiry',
      enquiryEyebrow: 'FLOOR B2 — CONTACT VOLKER SCHNÜTTGEN',
      enquiryTitle: 'Send an Enquiry',
      enquiryMeta:
        'Direct studio contact: mail@volker-schnuettgen.com · +351 962 370 193 · Represented by zet gallery.',
      enquiryPreparedTitle: 'Enquiry prepared',
      enquiryPreparedBody: (name, subject) =>
        `Thank you, ${name}. Your ${subject.toLowerCase()} message has been prepared for the Sintra studio and zet gallery.`,
      nameLabel: 'NAME / INSTITUTION *',
      namePlaceholder: 'Your name or institution',
      emailLabel: 'EMAIL ADDRESS *',
      emailPlaceholder: 'name@institution.org',
      subjectLabel: 'SUBJECT',
      subjectOptions: [
        'Exhibition / Curatorial',
        'Public / Site Commission',
        'Gallery & Acquisition (zet gallery)',
        'Publication / Press',
      ],
      messageLabel: 'MESSAGE *',
      messagePlaceholder:
        'Write your enquiry regarding exhibitions, works or studio visits.',
      studioNote: 'STUDIO: [STUDIO] · SINTRA, PT',
      sendBtn: 'SEND MESSAGE',
      privacyTitle: 'Privacy Notice',
      privacyEyebrow: 'FLOOR B2 — LEGAL NOTICE',
      privacyBody1:
        'This portfolio presents documented works, exhibitions and biography of Volker Schnüttgen, sculptor and new media artist based in Sintra, Portugal.',
      privacyBody2:
        'Contact details submitted via enquiry are used solely to respond to curatorial, institutional or gallery correspondence.',
      privacyMeta:
        'CONTACT: MAIL@VOLKER-SCHNUETTGEN.COM · +351 962 370 193 · SINTRA, PORTUGAL',
    },
  },

  pt: {
    sidebar: {
      ariaNav: 'Navegação por secções do portfólio',
      ariaHome: 'Volker Schnüttgen — Voltar ao Índice',
      elevation: 'ELEVAÇÃO',
      floors: {
        index: 'ÍNDICE',
        projects: 'PROJETOS',
        practice: 'PRÁTICA',
        studio: 'BIOGRAFIA',
        journal: 'EXPOSIÇÕES',
        contact: 'CONTACTO',
      },
    },
    hero: {
      role: 'ESCULTOR · ARTISTA DE NOVOS MEDIA',
      origin: 'ATTENDORN, 1961 / SINTRA, PORTUGAL',
    },
    portfolio: {
      eyebrow: 'ÍNDICE 01–04 — PORTFÓLIO',
      title: 'Portfólio',
      subtitle:
        'Quatro categorias entre pedra, madeira, aço e novos media. Selecione um meio para explorar as obras.',
      allWorksBtn: 'TODAS AS OBRAS',
      catalogueEyebrow: 'PORTFÓLIO 01–17 — OBRAS',
      catalogueSubtitle:
        'Obras em pedra, madeira de carvalho, aço e instalação multimédia. Selecione qualquer obra para abrir o registo completo.',
      filters: {
        ALL: 'TODAS',
        STONE: 'PEDRA',
        WOOD: 'MADEIRA',
        STEEL: 'AÇO',
        'MEDIA / INSTALLATION': 'MEDIA / INSTALAÇÃO',
      },
      categories: {
        STONE: {
          title: 'Pedra',
          categoryLine: 'ESCULTURA · MONÓLITOS & OBRA PÚBLICA EM PEDRA',
          metaLine: 'FORMA ARCAICA · GRAVIDADE · LUGAR',
        },
        WOOD: {
          title: 'Madeira',
          categoryLine: 'CARVALHO · TRONCOS & VOLUMES TALHADOS',
          metaLine: 'MATÉRIA TERRITORIAL · INCISÃO',
        },
        STEEL: {
          title: 'Aço',
          categoryLine: 'PLANOS DOBRADOS · ESCULTURA ESTRUTURAL',
          metaLine: 'TENSÃO GEOMÉTRICA · ESPAÇO ABERTO',
        },
        'MEDIA / INSTALLATION': {
          title: 'Media / Instalação',
          categoryLine: 'INSTALAÇÃO ESPACIAL · MEDIA INTERATIVOS',
          metaLine: 'ESCULTURA · PERFORMANCE · SOM',
        },
      },
    },
    projectDetail: {
      location: 'LOCALIZAÇÃO',
      year: 'ANO',
      typology: 'TIPOLOGIA',
      medium: 'MEIO',
      context: 'CONTEXTO',
      sectionLabel: 'SECÇÃO A–A',
      approachLabel: 'ABORDAGEM',
      approachHeading: 'Matéria, forma, espaço',
      approachSubtitle: 'Como a obra se estrutura, em três notas.',
      nextWork: 'Próxima obra',
      allWorks: 'Todas as obras',
      typologyValues: {
        SCULPTURE: 'ESCULTURA',
        INSTALLATION: 'INSTALAÇÃO',
        'SITE & PUBLIC': 'SÍTIO & PÚBLICA',
        SERIES: 'SÉRIE',
      },
    },
    practice: {
      eyebrow: 'PISO M — PRÁTICA',
      title: 'Prática',
      subtitle:
        'Escultura, instalação, performance, gravura e novos media entre território e espaço.',
      disciplines: {
        sculpture: {
          title: 'Escultura',
          description:
            'Obras talhadas sobretudo em carvalho e pedra ligadas ao território. Minimalista na forma e atenta ao detalhe, cada escultura estabelece um signo, marca o lugar e abre um espaço simbólico enraizado na figuração arcaica e na geometria dos dólmenes.',
          tags: ['CARVALHO', 'PEDRA', 'FORMA ARCAICA', 'ESPAÇO SIMBÓLICO'],
        },
        installation: {
          title: 'Instalação',
          description:
            'Conjuntos espaciais onde os volumes escultóricos estruturam uma sala inteira ou paisagem, convidando à descoberta através da escala, proporção e tensão formal silenciosa.',
          tags: ['DESENHO ESPACIAL', 'MARCAÇÃO DE SÍTIO', 'PROPORÇÃO', 'HABITAT'],
        },
        performance: {
          title: 'Performance & Colaboração',
          description:
            'Produções interdisciplinares que unem escultura, coreografia e som — exemplificadas por Habitat (2010), coproduzida com o coletivo de dança LaborGras no Radialsystem V, Berlim.',
          tags: ['LABORGRAS', 'DANÇA', 'PAISAGEM SONORA', 'RADIALSYSTEM V'],
        },
        engraving: {
          title: 'Gravura',
          description:
            'Baseada nos seus estudos de escultura e gravura iniciados em 1982 na Universidade das Artes de Bremen, mantendo rigor de linha, incisão e disciplina de superfície.',
          tags: ['BREMEN 1982', 'INCISÃO', 'SUPERFÍCIE', 'GRAVURA'],
        },
        'new-media': {
          title: 'Novos Media',
          description:
            'Sistemas interativos e obras baseadas no tempo, informadas pela bolsa da Fundação Calouste Gulbenkian em Berlim (2004) e pelo Mestrado em Arte Multimédia na FBAUP (2008).',
          tags: ['ARTE MULTIMÉDIA', 'FBAUP 2008', 'BERLIM 2004', 'INTERATIVO'],
        },
      },
    },
    studio: {
      eyebrow: 'PISO 00 — BIOGRAFIA',
      title: 'Biografia',
      subtitle: 'Sintra, Portugal desde 1993. Representado pela zet gallery.',
      bio: 'Nascido em Attendorn, Alemanha, em 1961, Volker Schnüttgen iniciou estudos de escultura e gravura na Universidade das Artes de Bremen em 1982 e concluiu o Mestrado em Arte Multimédia na FBAUP em 2008. Bolseiro do Ministério dos Negócios Estrangeiros português (1992), distinguido com o Prémio de Cultura do Conselho de Olpe (1999), bolseiro da Fundação Calouste Gulbenkian em Berlim (2004) e apoiado pelo Capital Berlin Cultural Fund (2010), vive e trabalha permanentemente em Sintra desde 1993.',
      groundFloor: 'PISO TÉRREO',
      caption: 'ESTÚDIO DE SINTRA — ESTUDO ESPACIAL & ARQUIVO',
      openShuttersAria: 'Abrir painéis do arquivo de estúdio',
      closeShuttersAria: 'Fechar painéis do arquivo de estúdio',
      statLabels: [
        'NASCIDO EM ATTENDORN, ALEMANHA',
        'A VIVER E TRABALHAR EM SINTRA',
        'PROFESSOR DE ESCULTURA NA FBAUP',
        'EXPOSIÇÕES & CONCURSOS DESDE',
      ],
    },
    journal: {
      eyebrow: 'PISO B1 — EXPOSIÇÕES & PUBLICAÇÕES',
      title: 'Exposições',
      subtitle: 'Exposições curatoriais selecionadas, diálogos e publicações monográficas.',
      allEntriesBtn: 'TODAS AS EXPOSIÇÕES E LIVROS',
      nextEntry: 'Próxima entrada',
      allEntriesLink: 'Todas as entradas',
      categories: {
        EXHIBITION: 'EXPOSIÇÃO',
        PUBLICATION: 'PUBLICAÇÃO',
      },
      entries: {
        'geography-of-mysteries': {
          date: 'CENTRO CULTURAL DE CASCAIS',
          title: 'A Geography of Mysteries — Centro Cultural de Cascais',
          subtitle:
            'Curadoria de Helena Mendes Pereira (zet gallery). Organizada em quatro espaços distintos correspondentes a séries dedicadas de obras de Volker Schnüttgen.',
          creditLabel: 'CURADORIA DE',
          creditValue: 'HELENA MENDES PEREIRA (ZET GALLERY)',
          secondaryLabel: 'LOCAL',
          secondaryValue: 'CENTRO CULTURAL DE CASCAIS',
          introParagraphs: [
            'Apresentada no Centro Cultural de Cascais sob curadoria de Helena Mendes Pereira (zet gallery), A Geography of Mysteries desdobra-se por quatro espaços arquitetónicos distintos, cada um ancorado numa série dedicada de esculturas e instalações espaciais.',
            'Trabalhando sobretudo com madeira de carvalho e pedra ligadas diretamente ao território, Volker Schnüttgen aborda a escultura como um sistema de signos que articula o espaço em vez de o preencher. Cada sala estabelece a sua própria cadência de massa, intervalo e silêncio.',
          ],
          largeHeading: 'Quatro espaços, uma gramática espacial',
          largeHeadingText:
            'Ao longo das quatro salas da exposição, obras em carvalho talhado e pedra trabalhada dialogam com formas arcaicas e com a geometria duradoura dos dólmenes megalíticos — convidando o visitante a percorrer cada série como um território por descobrir.',
          subHeading: 'Matéria vinculada ao lugar',
          subHeadingText:
            'Minimalistas na forma e profundamente atentas ao detalhe da superfície, as peças registam o veio da madeira bruta, fissuras radiais e marcas de cinzel — transformando a matéria física em memória silenciosa.',
        },
        'dialogues-universonauta': {
          date: 'EXERCÍCIO CURATORIAL',
          title: 'Dialogue(s) with a Universonauta — Volker Schnüttgen & Domingos Loureiro',
          subtitle:
            'Um exercício curatorial concebido por Helena Mendes Pereira que reúne obras de Volker Schnüttgen e Domingos Loureiro.',
          creditLabel: 'CURADORIA DE',
          creditValue: 'HELENA MENDES PEREIRA',
          secondaryLabel: 'ARTISTAS',
          secondaryValue: 'VOLKER SCHNÜTTGEN · DOMINGOS LOUREIRO',
          introParagraphs: [
            'Concebida como um exercício curatorial por Helena Mendes Pereira, Dialogue(s) with a Universonauta coloca o vocabulário escultórico de Volker Schnüttgen em conversa direta com a obra de Domingos Loureiro.',
            'Em vez de enquadrar cada artista isoladamente, a exposição traça questões partilhadas de gesto, tensão de superfície e do modo como a presença material constrói um espaço simbólico aberto entre observador e obra.',
          ],
          largeHeading: 'Construir um diálogo partilhado',
          largeHeadingText:
            'Lado a lado, os volumes sólidos de Schnüttgen em madeira e pedra entram em contraponto com as investigações pictóricas e espaciais de Loureiro — revelando ressonâncias inesperadas de escala, ritmo e contenção.',
          subHeading: 'A forma como padrão e signo',
          subHeadingText:
            'Informada por décadas de diálogo entre escultura, gravura e arte multimédia entre a Alemanha e Portugal, a exposição afirma a arte como encontro contínuo e não como declaração fechada.',
        },
        'monograph-1986-2021': {
          date: '1986–2021',
          title: 'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021)',
          subtitle:
            'Monografia abrangente com ensaios críticos de Gisela Rosenthal e outros autores, documentando trinta e cinco anos de obra escultórica e espacial.',
          creditLabel: 'TEXTOS DE',
          creditValue: 'GISELA ROSENTHAL E AUTORES',
          secondaryLabel: 'PERÍODO DE ARQUIVO',
          secondaryValue: '1986 — 2021',
          introParagraphs: [
            'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021) reúne trinta e cinco anos de escultura, instalações públicas, performances colaborativas e investigações em novos media num único volume crítico.',
            'Iniciando-se com a formação em escultura e gravura na Universidade das Artes de Bremen (1982) e obras iniciais em pedra na Alemanha como Der Steinsetzer (1989), a monografia acompanha a fixação permanente em Sintra a partir de 1993.',
          ],
          largeHeading: 'Entre Sintra, Porto e Berlim',
          largeHeadingText:
            'Juntamente com monólitos exteriores e obras em madeira documentadas, a publicação examina marcos interdisciplinares decisivos — incluindo a bolsa da Fundação Calouste Gulbenkian em Berlim (2004), o Mestrado em Arte Multimédia na FBAUP (2008) e a coprodução Habitat no Radialsystem V em Berlim (2010).',
          subHeading: 'Trinta e cinco anos de prática técnico-poética',
          subHeadingText:
            'Trazendo o arquivo até obras recentes como Abrigo I e II (2019), O Bosque (Trindade) (2019) e Livros (2021), os ensaios de Gisela Rosenthal e demais autores enquadram a investigação duradoura de Schnüttgen sobre matéria, memória e lugar.',
        },
      },
    },
    contact: {
      eyebrow: 'PISO B2 — CONTACTO',
      title: 'Contacto & Estúdio',
      subtitle:
        'Para propostas de exposição, encomendas institucionais e contactos curatoriais.',
      form: {
        nameLabel: 'NOME *',
        namePlaceholder: 'O seu nome completo',
        emailLabel: 'EMAIL *',
        emailPlaceholder: 'nome@instituicao.org',
        orgLabel: 'INSTITUIÇÃO',
        orgPlaceholder: 'Galeria, museu ou entidade',
        locationLabel: 'LOCALIZAÇÃO',
        locationPlaceholder: 'Cidade, país',
        subjectLabel: 'ASSUNTO',
        subjectOptions: [
          'Exposição / Curadoria',
          'Encomenda Pública / Sítio',
          'Galeria & Aquisição (zet gallery)',
          'Publicação / Imprensa',
        ],
        scopeLabel: 'CONTEXTO',
        scopeOptions: [
          'Ainda por definir',
          'Próxima exposição',
          'Arquivo institucional',
          'Visita ao estúdio',
        ],
        messageLabel: 'SOBRE O PEDIDO *',
        messagePlaceholder:
          'Detalhes da exposição, contexto do espaço, prazos ou notas curatoriais.',
        submitBtn: 'ENVIAR PEDIDO',
        confirmedTitle: 'Pedido preparado',
        confirmedBody: (name, subject) =>
          `Obrigado, ${name}. A sua nota sobre ${subject.toLowerCase()} foi preparada para o estúdio em Sintra e para a zet gallery.`,
        newEnquiryBtn: 'NOVO PEDIDO',
      },
      directContact: 'CONTACTO DIRETO',
      copiedLabel: 'COPIADO',
      studioLabel: 'ESTÚDIO',
      representationLabel: 'REPRESENTAÇÃO',
      representationRole: 'Representação de Galeria',
      privacy: 'PRIVACIDADE',
      adminPortal: 'ESTÚDIO ADMIN',
      copyright: '© VOLKER SCHNÜTTGEN — SINTRA, PORTUGAL',
    },
    modals: {
      close: 'FECHAR',
      archiveEyebrow: 'PISO B1 — EXPOSIÇÕES & MONOGRAFIA',
      archiveTitle: 'Exposições & Publicações',
      archiveSubtitle: 'Projetos curatoriais e documentação monográfica publicada.',
      recordsCount: (n) => `${n} REGISTOS`,
      filterAll: 'TODAS',
      filterExhibition: 'EXPOSIÇÃO',
      filterPublication: 'PUBLICAÇÃO',
      enquiryDialogTitle: 'Contacto de Estúdio',
      enquiryEyebrow: 'PISO B2 — CONTACTAR VOLKER SCHNÜTTGEN',
      enquiryTitle: 'Enviar Pedido',
      enquiryMeta:
        'Contacto direto do estúdio: mail@volker-schnuettgen.com · +351 962 370 193 · Representado pela zet gallery.',
      enquiryPreparedTitle: 'Pedido preparado',
      enquiryPreparedBody: (name, subject) =>
        `Obrigado, ${name}. A sua mensagem sobre ${subject.toLowerCase()} foi preparada para o estúdio em Sintra e para a zet gallery.`,
      nameLabel: 'NOME / INSTITUIÇÃO *',
      namePlaceholder: 'O seu nome ou instituição',
      emailLabel: 'ENDEREÇO DE EMAIL *',
      emailPlaceholder: 'nome@instituicao.org',
      subjectLabel: 'ASSUNTO',
      subjectOptions: [
        'Exposição / Curadoria',
        'Encomenda Pública / Sítio',
        'Galeria & Aquisição (zet gallery)',
        'Publicação / Imprensa',
      ],
      messageLabel: 'MENSAGEM *',
      messagePlaceholder:
        'Escreva o seu pedido relativo a exposições, obras ou visitas ao estúdio.',
      studioNote: 'ESTÚDIO: [STUDIO] · SINTRA, PT',
      sendBtn: 'ENVIAR MENSAGEM',
      privacyTitle: 'Nota de Privacidade',
      privacyEyebrow: 'PISO B2 — AVISO LEGAL',
      privacyBody1:
        'Este portfólio apresenta obras documentadas, exposições e a biografia de Volker Schnüttgen, escultor e artista de novos media radicado em Sintra, Portugal.',
      privacyBody2:
        'Os dados de contacto submetidos através de pedido são utilizados exclusivamente para responder a correspondência curatorial, institucional ou de galeria.',
      privacyMeta:
        'CONTACTO: MAIL@VOLKER-SCHNUETTGEN.COM · +351 962 370 193 · SINTRA, PORTUGAL',
    },
  },

  de: {
    sidebar: {
      ariaNav: 'Navigation der Portfolio-Bereiche',
      ariaHome: 'Volker Schnüttgen — Zurück zum Index',
      elevation: 'HÖHE',
      floors: {
        index: 'INDEX',
        projects: 'PROJEKTE',
        practice: 'PRAXIS',
        studio: 'BIOGRAFIE',
        journal: 'JOURNAL',
        contact: 'KONTAKT',
      },
    },
    hero: {
      role: 'BILDHAUER · MEDIENKÜNSTLER',
      origin: 'ATTENDORN, 1961 / SINTRA, PORTUGAL',
    },
    portfolio: {
      eyebrow: 'INDEX 01–04 — PORTFOLIO',
      title: 'Portfolio',
      subtitle:
        'Vier Kategorien aus Stein, Holz, Stahl und neuen Medien. Wählen Sie ein Medium zur Werkauswahl.',
      allWorksBtn: 'ALLE WERKE',
      catalogueEyebrow: 'PORTFOLIO 01–17 — WERKE',
      catalogueSubtitle:
        'Arbeiten aus Stein, Eichenholz, Stahl und Medieninstallation. Wählen Sie ein Werk für die vollständige Dokumentation.',
      filters: {
        ALL: 'ALLE',
        STONE: 'STEIN',
        WOOD: 'HOLZ',
        STEEL: 'STAHL',
        'MEDIA / INSTALLATION': 'MEDIEN / INSTALLATION',
      },
      categories: {
        STONE: {
          title: 'Stein',
          categoryLine: 'BILDHAUEREI · MONOLITHE & STEINARBEITEN',
          metaLine: 'ARCHAISCHE FORM · SCHWERE · ORT',
        },
        WOOD: {
          title: 'Holz',
          categoryLine: 'EICHENHOLZ · STÄMME & GESCHNITZTE VOLUMEN',
          metaLine: 'TERRITORIALES MATERIAL · EINSCHNITT',
        },
        STEEL: {
          title: 'Stahl',
          categoryLine: 'GEFALTETE FLÄCHEN · STRUKTURELLE SKULPTUR',
          metaLine: 'GEOMETRISCHE SPANNUNG · OFFENER RAUM',
        },
        'MEDIA / INSTALLATION': {
          title: 'Medien / Installation',
          categoryLine: 'RAUMINSTALLATION · INTERAKTIVE MEDIEN',
          metaLine: 'SKULPTUR · PERFORMANCE · KLANG',
        },
      },
    },
    projectDetail: {
      location: 'ORT',
      year: 'JAHR',
      typology: 'TYPOLOGIE',
      medium: 'MEDIUM',
      context: 'KONTEXT',
      sectionLabel: 'SCHNITT A–A',
      approachLabel: 'ANSATZ',
      approachHeading: 'Material, Form, Raum',
      approachSubtitle: 'Wie die Arbeit aufgebaut ist, in drei Notizen.',
      nextWork: 'Nächstes Werk',
      allWorks: 'Alle Werke',
      typologyValues: {
        SCULPTURE: 'SKULPTUR',
        INSTALLATION: 'INSTALLATION',
        'SITE & PUBLIC': 'ORT & ÖFFENTLICH',
        SERIES: 'SERIE',
      },
    },
    practice: {
      eyebrow: 'EBENE M — PRAXIS',
      title: 'Praxis',
      subtitle:
        'Bildhauerei, Installation, Performance, Druckgrafik und neue Medien zwischen Territorium und Raum.',
      disciplines: {
        sculpture: {
          title: 'Bildhauerei',
          description:
            'Vorwiegend aus Eiche und Stein geformte Werke, die eng mit dem Territorium verbunden sind. Minimalistisch in der Form und aufmerksam im Detail setzt jede Skulptur ein Zeichen, markiert den Ort und öffnet einen symbolischen Raum zwischen archaischer Figuration und Dolmen-Geometrie.',
          tags: ['EICHENHOLZ', 'STEIN', 'ARCHAISCHE FORM', 'SYMBOLISCHER RAUM'],
        },
        installation: {
          title: 'Installation',
          description:
            'Räumliche Ensembles, in denen skulpturale Volumen einen ganzen Raum oder eine Landschaft strukturieren und durch Maßstab, Proportion und ruhige formale Spannung zur Entdeckung einladen.',
          tags: ['RAUMGESTALTUNG', 'ORTSMARKIERUNG', 'PROPORTION', 'HABITAT'],
        },
        performance: {
          title: 'Performance & Kooperation',
          description:
            'Interdisziplinäre Produktionen, die Skulptur mit Choreografie und Klang verbinden – exemplarisch in Habitat (2010), koproduziert mit dem Tanzkollektiv LaborGras im Radialsystem V, Berlin.',
          tags: ['LABORGRAS', 'TANZ', 'KLANGRAUM', 'RADIALSYSTEM V'],
        },
        engraving: {
          title: 'Druckgrafik / Gravur',
          description:
            'Verwurzelt in seinem ab 1982 an der Hochschule für Künste Bremen begonnenen Studium der Bildhauerei und Grafik, geprägt von präziser Linienführung, Einschnitt und Oberflächendisziplin.',
          tags: ['BREMEN 1982', 'EINSCHNITT', 'OBERFLÄCHE', 'DRUCKGRAFIK'],
        },
        'new-media': {
          title: 'Neue Medien',
          description:
            'Interaktive Systeme und zeitbasierte Arbeiten, geprägt durch das Stipendium der Stiftung Calouste Gulbenkian in Berlin (2004) und seinen Master in Medienkunst an der FBAUP (2008).',
          tags: ['MEDIENKUNST', 'FBAUP 2008', 'BERLIN 2004', 'INTERAKTIV'],
        },
      },
    },
    studio: {
      eyebrow: 'EBENE 00 — BIOGRAFIE',
      title: 'Biografie',
      subtitle: 'Seit 1993 in Sintra, Portugal. Vertreten durch die zet gallery.',
      bio: '1961 in Attendorn, Deutschland, geboren, begann Volker Schnüttgen 1982 das Studium der Bildhauerei und Grafik an der Hochschule für Künste Bremen und schloss 2008 den Master in Medienkunst an der FBAUP ab. Ausgezeichnet mit einem Stipendium des portugiesischen Außenministeriums (1992), dem Kulturpreis des Kreises Olpe (1999), einem Stipendium der Stiftung Calouste Gulbenkian in Berlin (2004) sowie der Förderung durch den Hauptstadtkulturfonds Berlin (2010), lebt und arbeitet er seit 1993 dauerhaft in Sintra.',
      groundFloor: 'ERDGESCHOSS',
      caption: 'ATELIER SINTRA — RAUMSTUDIE & ARCHIV',
      openShuttersAria: 'Atelier-Archivblenden öffnen',
      closeShuttersAria: 'Atelier-Archivblenden schließen',
      statLabels: [
        'GEBOREN IN ATTENDORN, DEUTSCHLAND',
        'LEBT & ARBEITET IN SINTRA',
        'DOZENT FÜR BILDHAUEREI AN DER FBAUP',
        'AUSSTELLUNGEN & WETTBEWERBE SEIT',
      ],
    },
    journal: {
      eyebrow: 'EBENE B1 — AUSSTELLUNGEN & PUBLIKATIONEN',
      title: 'Ausstellungen',
      subtitle: 'Ausgewählte kuratorische Ausstellungen, Dialoge und Monografien.',
      allEntriesBtn: 'ALLE AUSSTELLUNGEN & BÜCHER',
      nextEntry: 'Nächster Beitrag',
      allEntriesLink: 'Alle Beiträge',
      categories: {
        EXHIBITION: 'AUSSTELLUNG',
        PUBLICATION: 'PUBLIKATION',
      },
      entries: {
        'geography-of-mysteries': {
          date: 'CENTRO CULTURAL DE CASCAIS',
          title: 'A Geography of Mysteries — Centro Cultural de Cascais',
          subtitle:
            'Kuratiert von Helena Mendes Pereira (zet gallery). Strukturiert über vier eigenständige Räume mit spezifischen Werkserien von Volker Schnüttgen.',
          creditLabel: 'KURATIERT VON',
          creditValue: 'HELENA MENDES PEREIRA (ZET GALLERY)',
          secondaryLabel: 'AUSSTELLUNGSORT',
          secondaryValue: 'CENTRO CULTURAL DE CASCAIS',
          introParagraphs: [
            'Präsentiert im Centro Cultural de Cascais unter der Kuration von Helena Mendes Pereira (zet gallery), entfaltet sich A Geography of Mysteries über vier architektonisch getrennte Räume, jeweils getragen von einer eigenen Serie aus Skulpturen und Rauminstallationen.',
            'Mit Eichenholz und Naturstein als unmittelbar ortsgebundenen Materialien begreift Volker Schnüttgen Skulptur als ein Zeichensystem, das Raum gliedert statt ihn zu füllen. Jeder Raum entwickelt seinen eigenen Rhythmus aus Masse, Intervall und Stille.',
          ],
          largeHeading: 'Vier Räume, eine räumliche Grammatik',
          largeHeadingText:
            'In den vier Ausstellungsräumen knüpfen Arbeiten aus geschnitzter Eiche und behauenem Stein an archaische Formen und die beständige Geometrie megalithischer Dolmen an – und laden die Besucher ein, jede Werkreihe als begehbares Territorium zu erleben.',
          subHeading: 'Ortsgebundene Materialität',
          subHeadingText:
            'Minimalistisch in der Formensprache und präzise im Detail der Oberfläche bewahren die Arbeiten natürliche Holzmaserung, radiale Risse und Meißelspuren – und verwandeln physische Materie in ruhige Erinnerung.',
        },
        'dialogues-universonauta': {
          date: 'KURATORISCHE ÜBUNG',
          title: 'Dialogue(s) with a Universonauta — Volker Schnüttgen & Domingos Loureiro',
          subtitle:
            'Eine von Helena Mendes Pereira konzipierte kuratorische Begegnung zwischen Werken von Volker Schnüttgen und Domingos Loureiro.',
          creditLabel: 'KURATIERT VON',
          creditValue: 'HELENA MENDES PEREIRA',
          secondaryLabel: 'KÜNSTLER',
          secondaryValue: 'VOLKER SCHNÜTTGEN · DOMINGOS LOUREIRO',
          introParagraphs: [
            'Als kuratorisches Projekt von Helena Mendes Pereira konzipiert, bringt Dialogue(s) with a Universonauta die skulpturale Formensprache von Volker Schnüttgen in einen direkten Dialog mit der Arbeit von Domingos Loureiro.',
            'Anstatt beide Positionen getrennt zu betrachten, spürt die Ausstellung gemeinsamen Fragen nach Geste, Oberflächenspannung und der Entstehung eines offenen symbolischen Raums zwischen Werk und Betrachter nach.',
          ],
          largeHeading: 'Einen gemeinsamen Dialog aufbauen',
          largeHeadingText:
            'Nebeneinander gestellt treten Schnüttgens geerdete Volumen aus Holz und Stein in einen Kontrapunkt zu Loureiros malerischen und räumlichen Untersuchungen – und offenbaren unerwartete Resonanzen von Maßstab, Rhythmus und Reduktion.',
          subHeading: 'Form als Muster und Zeichen',
          subHeadingText:
            'Geprägt von Jahrzehnten des Austauschs zwischen Bildhauerei, Grafik und Medienkunst in Deutschland und Portugal stellt die Ausstellung Kunst als fortlaufende Begegnung in den Mittelpunkt.',
        },
        'monograph-1986-2021': {
          date: '1986–2021',
          title: 'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021)',
          subtitle:
            'Umfassende Monografie mit kritischen Texten von Gisela Rosenthal und weiteren Autoren über fünfunddreißig Jahre bildhauerischer und räumlicher Arbeit.',
          creditLabel: 'TEXTE VON',
          creditValue: 'GISELA ROSENTHAL & AUTOREN',
          secondaryLabel: 'ARCHIVZEITRAUM',
          secondaryValue: '1986 — 2021',
          introParagraphs: [
            'Volker Schnüttgen: experiências técnico-poéticas de um escultor, obra (1986–2021) versammelt fünfunddreißig Jahre Bildhauerei, Installationen im öffentlichen Raum, kollaborative Performances und Arbeiten in den neuen Medien in einem kritischen Gesamtband.',
            'Ausgehend von seiner Ausbildung in Bildhauerei und Grafik an der Hochschule für Künste Bremen (1982) und frühen deutschen Steinarbeiten wie Der Steinsetzer (1989) verfolgt die Monografie seinen dauerhaften Umzug nach Sintra im Jahr 1993.',
          ],
          largeHeading: 'Zwischen Sintra, Porto und Berlin',
          largeHeadingText:
            'Neben dokumentierten Monolithen und Holzarbeiten beleuchtet die Publikation zentrale interdisziplinäre Stationen – darunter das Stipendium der Stiftung Calouste Gulbenkian in Berlin (2004), den Master in Medienkunst an der FBAUP (2008) sowie die Berliner Koproduktion Habitat im Radialsystem V (2010).',
          subHeading: 'Fünfunddreißig Jahre technisch-poetischer Praxis',
          subHeadingText:
            'Bis hin zu jüngeren Werken wie Abrigo I e II (2019), O Bosque (Trindade) (2019) und Livros (2021) zeichnen die Essays von Gisela Rosenthal und Mitautoren Schnüttgens beständige Auseinandersetzung mit Materie, Erinnerung und Ort nach.',
        },
      },
    },
    contact: {
      eyebrow: 'EBENE B2 — KONTAKT',
      title: 'Kontakt & Atelier',
      subtitle:
        'Für Ausstellungsprojekte, institutionelle Aufträge und kuratorische Anfragen.',
      form: {
        nameLabel: 'NAME *',
        namePlaceholder: 'Ihr vollständiger Name',
        emailLabel: 'E-MAIL *',
        emailPlaceholder: 'name@institution.org',
        orgLabel: 'INSTITUTION',
        orgPlaceholder: 'Galerie, Museum oder Institution',
        locationLabel: 'ORT',
        locationPlaceholder: 'Stadt, Land',
        subjectLabel: 'THEMA DER ANFRAGE',
        subjectOptions: [
          'Ausstellung / Kuration',
          'Kunst im öffentlichen Raum',
          'Galerie & Erwerb (zet gallery)',
          'Publikation / Presse',
        ],
        scopeLabel: 'KONTEXT',
        scopeOptions: [
          'Noch offen',
          'Geplante Ausstellung',
          'Institutionelles Archiv',
          'Atelierbesuch',
        ],
        messageLabel: 'ZU IHRER ANFRAGE *',
        messagePlaceholder:
          'Angaben zur Ausstellung, zum Ort, Zeitrahmen oder kuratorische Notizen.',
        submitBtn: 'ANFRAGE SENDEN',
        confirmedTitle: 'Anfrage vorbereitet',
        confirmedBody: (name, subject) =>
          `Vielen Dank, ${name}. Ihre Anfrage zum Thema ${subject.toLowerCase()} wurde für das Atelier in Sintra und die zet gallery vorbereitet.`,
        newEnquiryBtn: 'NEUE ANFRAGE',
      },
      directContact: 'DIREKTKONTAKT',
      copiedLabel: 'KOPIERT',
      studioLabel: 'ATELIER',
      representationLabel: 'VERTRETUNG',
      representationRole: 'Galerievertretung',
      privacy: 'DATENSCHUTZ',
      adminPortal: 'ADMIN-BEREICH',
      copyright: '© VOLKER SCHNÜTTGEN — SINTRA, PORTUGAL',
    },
    modals: {
      close: 'SCHLIESSEN',
      archiveEyebrow: 'EBENE B1 — AUSSTELLUNGEN & MONOGRAFIE',
      archiveTitle: 'Ausstellungen & Publikationen',
      archiveSubtitle: 'Kuratorische Projekte und dokumentierte Werkmonografie.',
      recordsCount: (n) => `${n} EINTRÄGE`,
      filterAll: 'ALLE',
      filterExhibition: 'AUSSTELLUNG',
      filterPublication: 'PUBLIKATION',
      enquiryDialogTitle: 'Atelier-Anfrage',
      enquiryEyebrow: 'EBENE B2 — KONTAKT VOLKER SCHNÜTTGEN',
      enquiryTitle: 'Anfrage senden',
      enquiryMeta:
        'Direktkontakt Atelier: mail@volker-schnuettgen.com · +351 962 370 193 · Vertreten durch zet gallery.',
      enquiryPreparedTitle: 'Anfrage vorbereitet',
      enquiryPreparedBody: (name, subject) =>
        `Vielen Dank, ${name}. Ihre Nachricht zum Thema ${subject.toLowerCase()} wurde für das Atelier in Sintra und die zet gallery vorbereitet.`,
      nameLabel: 'NAME / INSTITUTION *',
      namePlaceholder: 'Ihr Name oder Ihre Institution',
      emailLabel: 'E-MAIL-ADRESSE *',
      emailPlaceholder: 'name@institution.org',
      subjectLabel: 'BETREFF',
      subjectOptions: [
        'Ausstellung / Kuration',
        'Kunst im öffentlichen Raum',
        'Galerie & Erwerb (zet gallery)',
        'Publikation / Presse',
      ],
      messageLabel: 'NACHRICHT *',
      messagePlaceholder:
        'Schreiben Sie Ihre Anfrage zu Ausstellungen, Werken oder Atelierbesuchen.',
      studioNote: 'ATELIER: [STUDIO] · SINTRA, PT',
      sendBtn: 'NACHRICHT SENDEN',
      privacyTitle: 'Datenschutzhinweis',
      privacyEyebrow: 'EBENE B2 — RECHTLICHER HINWEIS',
      privacyBody1:
        'Dieses Portfolio präsentiert dokumentierte Werke, Ausstellungen und die Biografie von Volker Schnüttgen, Bildhauer und Medienkünstler in Sintra, Portugal.',
      privacyBody2:
        'Über das Kontaktformular übermittelte Angaben werden ausschließlich zur Beantwortung kuratorischer, institutioneller oder galeristischer Anfragen verwendet.',
      privacyMeta:
        'KONTAKT: MAIL@VOLKER-SCHNUETTGEN.COM · +351 962 370 193 · SINTRA, PORTUGAL',
    },
  },
};

export function getLocalizedCategory(
  category: PortfolioCategoryItem,
  language: Language,
): PortfolioCategoryItem {
  if (language === 'en') return category;
  const localized = UI_TRANSLATIONS[language].portfolio.categories[category.id];
  if (!localized) return category;
  return {
    ...category,
    title: localized.title,
    categoryLine: localized.categoryLine,
    metaLine: localized.metaLine,
  };
}

export function getCategoryFilterLabel(
  categoryId: string,
  language: Language,
  fallbackTitle?: string,
): string {
  return (
    UI_TRANSLATIONS[language].portfolio.filters[categoryId] ??
    (fallbackTitle ? fallbackTitle.toUpperCase() : categoryId.toUpperCase())
  );
}

export function getLocalizedStudioStats(
  stats: StudioStat[],
  language: Language,
): StudioStat[] {
  if (language === 'en') return stats;
  const labels = UI_TRANSLATIONS[language].studio.statLabels;
  return stats.map((s, idx) => ({
    ...s,
    label: labels[idx] ?? s.label,
  }));
}

export function getLocalizedJournalEntry(
  entry: JournalEntry,
  language: Language,
): JournalEntry {
  if (language === 'en') return entry;
  const loc = UI_TRANSLATIONS[language].journal.entries[entry.id];
  if (!loc) return entry;
  return {
    ...entry,
    date: loc.date,
    title: loc.title,
    subtitle: loc.subtitle,
    creditLabel: loc.creditLabel,
    creditValue: loc.creditValue,
    secondaryLabel: loc.secondaryLabel,
    secondaryValue: loc.secondaryValue,
    introParagraphs: loc.introParagraphs,
    largeHeading: loc.largeHeading,
    largeHeadingText: loc.largeHeadingText,
    subHeading: loc.subHeading,
    subHeadingText: loc.subHeadingText,
  };
}
