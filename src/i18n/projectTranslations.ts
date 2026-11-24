import {
  PROJECTS,
  type ProjectItem,
  type ProjectStep,
} from '../data/formtectureData';
import type { Language } from './LanguageContext';

export interface LocalizedProjectContent {
  title?: string;
  categoryLine: string;
  medium: string;
  context: string;
  lead: string;
  steps: [ProjectStep, ProjectStep, ProjectStep];
}

export const PT_PROJECTS: Record<string, LocalizedProjectContent> = {
  livros: {
    categoryLine: 'ESCULTURA · MATERIALIDADE TERRITORIAL',
    medium: 'MADEIRA DE CARVALHO · ESCULTURA',
    context: 'ZET GALLERY / 1986–2021',
    lead: 'Volumes escultóricos minimalistas em forma de livros. Madeira bruta e incisão contida tratam a matéria como registo duradouro de lugar e tempo.',
    steps: [
      {
        label: 'Matéria',
        text: 'Talhada em blocos maciços de madeira ligados ao território, preservando o veio natural, fissuras e peso de superfície.',
      },
      {
        label: 'Forma',
        text: 'Reduzida a geometrias de livros abertos e fechados onde cortes mínimos estabelecem ritmo sem gesto ornamental.',
      },
      {
        label: 'Contexto',
        text: 'Criada em 2021 e documentada na monografia retrospetiva que abrange a obra de Volker Schnüttgen entre 1986 e 2021.',
      },
    ],
  },
  'o-bosque-trindade': {
    categoryLine: 'ESCULTURA & INSTALAÇÃO ESPACIAL',
    medium: 'CARVALHO · INSTALAÇÃO',
    context: 'EXPOSIÇÃO ESPACIAL · 2019',
    lead: 'Um campo de monólitos verticais de carvalho distribuídos pela sala. A instalação marca o espaço como uma floresta de signos por descobrir.',
    steps: [
      {
        label: 'Matéria',
        text: 'Elementos verticais em carvalho trabalhados com marcas contidas de ferramenta para manter legível a densidade da madeira bruta à escala do corpo.',
      },
      {
        label: 'Forma',
        text: 'Espaçados como troncos erguidos ou marcos megalíticos, estabelecendo um padrão que transforma o chão em território simbólico.',
      },
      {
        label: 'Contexto',
        text: 'Realizada em 2019 como parte da investigação espacial de Schnüttgen entre imaginário florestal ancestral e arquitetura de galeria.',
      },
    ],
  },
  'abrigo-i-e-ii': {
    categoryLine: 'ESCULTURA · FORMA ARQUITETÓNICA',
    medium: 'PEDRA & CARVALHO · ESCULTURA',
    context: 'OBRAS EMPARELHADAS · 2019',
    lead: 'Duas esculturas em diálogo sobre abrigo e limiar. Pedra pesada e madeira encontram-se em formas que evocam dólmenes arcaicos.',
    steps: [
      {
        label: 'Matéria',
        text: 'Combina massa pétrea desbastada e vigas maciças de madeira ancoradas unicamente por gravidade, apoio e equilíbrio.',
      },
      {
        label: 'Forma',
        text: 'Recorre diretamente à clareza semiótica dos dólmenes megalíticos — criando uma sombra interior e um refúgio espacial silencioso.',
      },
      {
        label: 'Contexto',
        text: 'Concluída em 2019 como duas estruturas companheiras que prolongam a investigação do artista sobre habitar, proteção e lugar.',
      },
    ],
  },
  'trilogia-de-um-carvalho': {
    categoryLine: 'ESCULTURA · MADEIRA DE CARVALHO',
    medium: 'TRONCOS DE CARVALHO TALHADOS',
    context: 'ESTÚDIO DE SINTRA · 2011',
    lead: 'Três formas monumentais talhadas em troncos de carvalho. Cada volume regista crescimento, peso e intervenção geométrica deliberada.',
    steps: [
      {
        label: 'Matéria',
        text: 'Carvalho maciço recolhido no território local, respeitando nós, fendas radiais e pátina natural da superfície.',
      },
      {
        label: 'Forma',
        text: 'Disposta numa sequência tripartida em que cortes subtis e facetas planas instauram diálogo no solo.',
      },
      {
        label: 'Contexto',
        text: 'Produzida em 2011 em Sintra, assinalando uma obra-chave no longo estudo de Volker Schnüttgen sobre o carvalho como meio escultórico.',
      },
    ],
  },
  habitat: {
    categoryLine: 'INSTALAÇÃO · ESCULTURAS EM CARVALHO, DANÇA & SOM',
    medium: 'ESCULTURA EM CARVALHO · MEDIA INTERATIVOS',
    context: 'LABORGRAS · RADIALSYSTEM V',
    lead: 'Uma instalação habitável em carvalho que une escultura, coreografia e som ao vivo. Concebida em coprodução com o coletivo de dança LaborGras.',
    steps: [
      {
        label: 'Matéria',
        text: 'Arquitetura escultórica em carvalho articulada com sistemas media interativos de Frieder Weiss e paisagem sonora de Giorgio de Santis.',
      },
      {
        label: 'Forma',
        text: 'Funciona simultaneamente como escultura, palco de performance e habitat espacial partilhado percorrido por bailarinos e público.',
      },
      {
        label: 'Contexto',
        text: 'Estreada no Radialsystem V, Berlim, em 2010 com o apoio do Capital Berlin Cultural Fund.',
      },
    ],
  },
  'espacos-virtuais': {
    categoryLine: 'SÉRIE · ARTE MULTIMÉDIA & ESTUDO ESPACIAL',
    medium: 'NOVOS MEDIA · SÉRIE ESPACIAL',
    context: 'FBAUP ARTE MULTIMÉDIA · 2008',
    lead: 'Uma série em oito partes que estabelece ponte entre a perceção escultórica física e ambientes espaciais virtuais.',
    steps: [
      {
        label: 'Matéria',
        text: 'Estudos espaciais digitais informados pela formação do artista em novas tecnologias em Berlim (2004), com bolsa da Fundação Calouste Gulbenkian.',
      },
      {
        label: 'Forma',
        text: 'Articulada em oito estudos sequenciais que examinam limite, luz e profundidade virtual.',
      },
      {
        label: 'Contexto',
        text: 'Desenvolvida em 2008 em paralelo com o Mestrado em Arte Multimédia na FBAUP, Porto.',
      },
    ],
  },
  pieta: {
    categoryLine: 'ESCULTURA · FIGURAÇÃO ARCAICA',
    medium: 'ESCULTURA',
    context: 'OBRA ÚNICA · 2007',
    lead: 'Figuração arcaica condensada em massa escultórica silenciosa. Gesto antigo traduzido em forma contemporânea minimalista.',
    steps: [
      {
        label: 'Matéria',
        text: 'Talhada em massa escultórica sólida com rigorosa atenção às transições de superfície e tensão das arestas.',
      },
      {
        label: 'Forma',
        text: 'Traça um percurso da memória figurativa arcaica até uma abstração geométrica depurada.',
      },
      {
        label: 'Contexto',
        text: 'Criada em 2007 durante o período de estúdio de Volker Schnüttgen em Sintra.',
      },
    ],
  },
  'quadrado-negro': {
    categoryLine: 'ESCULTURA · REDUÇÃO GEOMÉTRICA',
    medium: 'ESCULTURA',
    context: 'OBRA ÚNICA · 2007',
    lead: 'Um signo geométrico austero ancorado no espaço. Volume minimalista reduzido a puro peso e contorno.',
    steps: [
      {
        label: 'Matéria',
        text: 'Superfície escurecida e corpo escultórico denso privilegiando a massa face ao detalhe descritivo.',
      },
      {
        label: 'Forma',
        text: 'Opera como marcador visual e âncora espacial dentro da sala de exposição.',
      },
      {
        label: 'Contexto',
        text: 'Concluída em 2007 como parte das investigações geométricas redutivas de Schnüttgen.',
      },
    ],
  },
  'alfabeto-escultorico': {
    categoryLine: 'SÉRIE · ESCULTURA SEMIÓTICA',
    medium: 'SÉRIE DE ESCULTURA',
    context: 'SÉRIE SEMIÓTICA · 2006',
    lead: 'Escultura articulada como gramática de signos. Formas individuais combinam-se como caracteres numa escrita ancestral.',
    steps: [
      {
        label: 'Matéria',
        text: 'Série de estudos táteis executados em materiais escultóricos naturais e estruturais.',
      },
      {
        label: 'Forma',
        text: 'Cada peça atua como unidade tipográfica distinta dentro de um vocabulário espacial por descobrir.',
      },
      {
        label: 'Contexto',
        text: 'Produzida em 2006, materializando a sua visão da escultura como um padrão que estabelece um signo.',
      },
    ],
  },
  'para-florbela-espanca': {
    categoryLine: 'ESCULTURA · OBRA DE HOMENAGEM',
    medium: 'ESCULTURA',
    context: 'PORTUGAL · 1998',
    lead: 'Um tributo escultórico dedicado à poetisa portuguesa Florbela Espanca. Contenção poética guardada em forma material silenciosa.',
    steps: [
      {
        label: 'Matéria',
        text: 'Trabalhada com disciplina manual cuidada, alicerçada nas tradições da pedra e da madeira.',
      },
      {
        label: 'Forma',
        text: 'Silhueta minimalista que cria um espaço contemplativo de memória e homenagem.',
      },
      {
        label: 'Contexto',
        text: 'Realizada em 1998 durante os primeiros anos de residência permanente do artista em Sintra.',
      },
    ],
  },
  satzzeichen: {
    categoryLine: 'SÉRIE · OBRA ESCULTÓRICA EM CINCO PARTES',
    medium: 'SÉRIE ESCULTÓRICA EM CINCO PARTES',
    context: 'SÉRIE · 1997',
    lead: 'Cinco sinais de pontuação escultóricos colocados em diálogo com a arquitetura. Cada peça introduz pausa e cadência.',
    steps: [
      {
        label: 'Matéria',
        text: 'Cinco elementos físicos trabalhados com arestas vivas e contraste tátil de superfície.',
      },
      {
        label: 'Forma',
        text: 'Funciona literalmente como pontuação espacial — dividindo, abrandando e enquadrando o movimento pela sala.',
      },
      {
        label: 'Contexto',
        text: 'Concluída em 1997 entre o rigor estrutural alemão e a prática de estúdio em Portugal.',
      },
    ],
  },
  'jogo-fatal': {
    categoryLine: 'ESCULTURA · OBRA EM DUAS PARTES',
    medium: 'ESCULTURA',
    context: 'CICLO EM DUAS PARTES · 1995–1997',
    lead: 'Um ciclo escultórico em duas partes desenvolvido entre 1995 e 1997. Volumes opostos sustentam a tensão física em equilíbrio.',
    steps: [
      {
        label: 'Matéria',
        text: 'Materiais densos moldados para revelar esforço estrutural e contrapeso.',
      },
      {
        label: 'Forma',
        text: 'Duas afirmações emparelhadas que testam equilíbrio, fratura e confronto espacial.',
      },
      {
        label: 'Contexto',
        text: 'Produzida entre 1995 e 1997 após a sua mudança permanente para Portugal.',
      },
    ],
  },
  'memoria-de-lisboa': {
    categoryLine: 'ESCULTURA · MEMÓRIA TERRITORIAL',
    medium: 'ESCULTURA',
    context: 'PORTUGAL · 1995',
    lead: 'Uma resposta escultórica inicial à luz, pedra e horizonte urbano de Lisboa, criada dois anos após se fixar em Sintra.',
    steps: [
      {
        label: 'Matéria',
        text: 'Assente em pedra bruta e permanência mineral que refletem o tecido calcário e granítico de Lisboa.',
      },
      {
        label: 'Forma',
        text: 'Memória arquitetónica compacta comprimida em planos escultóricos mínimos.',
      },
      {
        label: 'Contexto',
        text: 'Criada em 1995 após chegar a Portugal com uma bolsa do Ministério dos Negócios Estrangeiros.',
      },
    ],
  },
  'der-steinsetzer': {
    categoryLine: 'ESCULTURA · TRABALHO EM PEDRA',
    medium: 'ESCULTURA EM PEDRA',
    context: 'OBRA INICIAL · 1989',
    lead: 'Uma obra inicial em pedra produzida na Alemanha. Peso aterrado e pedra talhada à mão estabelecem as bases da sua linguagem posterior.',
    steps: [
      {
        label: 'Matéria',
        text: 'Pedra trabalhada diretamente a cinzel, maço e assentamento manual.',
      },
      {
        label: 'Forma',
        text: 'Ancora o gesto de assentar pedra — marcando solo, gravidade e medida humana.',
      },
      {
        label: 'Contexto',
        text: 'Executada em 1989 após os estudos de escultura e gravura na Universidade das Artes de Bremen.',
      },
    ],
  },
  'monumento-arvore-desconhecida': {
    categoryLine: 'ESCULTURA · MARCO TERRITORIAL',
    medium: 'MADEIRA & PEDRA · ESCULTURA',
    context: 'OBRA TERRITORIAL',
    lead: 'Um monumento silencioso dedicado a uma árvore desconhecida. A escultura torna-se marco ético em homenagem à presença natural na paisagem.',
    steps: [
      {
        label: 'Matéria',
        text: 'Madeira orgânica e pedra territorial reunidas sem artifício.',
      },
      {
        label: 'Forma',
        text: 'Marco vertical minimalista criando um lugar íntimo de pausa e reconhecimento.',
      },
      {
        label: 'Contexto',
        text: 'Reflete o diálogo recorrente de Volker Schnüttgen com a memória arbórea e a consciência ecológica.',
      },
    ],
  },
  'rosa-dos-ventos': {
    categoryLine: 'ESCULTURA DE SÍTIO · RESIDÊNCIA ARTÍSTICA',
    medium: 'ESCULTURA SITE-SPECIFIC',
    context: 'ALDEIA DO PONTIDO, FAFE',
    lead: 'Escultura de sítio criada durante uma residência artística na Aldeia do Pontido, Fafe, orientando os pontos cardeais no terreno.',
    steps: [
      {
        label: 'Matéria',
        text: 'Construída com materiais naturais duradouros adequados à topografia rural exposta do norte de Portugal.',
      },
      {
        label: 'Forma',
        text: 'Traduz a orientação cardeal num signo escultórico acessível e por descobrir.',
      },
      {
        label: 'Contexto',
        text: 'Resultante diretamente da residência do artista na Aldeia do Pontido, Fafe.',
      },
    ],
  },
  'common-home': {
    categoryLine: 'OBRA PÚBLICA · UNIVERSIDADE DO MINHO',
    medium: 'ESCULTURA PÚBLICA',
    context: 'CAMPUS DE AZURÉM, GUIMARÃES',
    lead: 'Obra pública permanente no Campus de Azurém da Universidade do Minho. Um abrigo arquetípico que assinala solo cívico partilhado.',
    steps: [
      {
        label: 'Matéria',
        text: 'Pedra natural monumental e madeira estrutural proporcionadas para implantação exterior permanente no campus.',
      },
      {
        label: 'Forma',
        text: 'Evoca um limiar aberto e casa ancestral — um lugar simbólico de encontro aberto a todos.',
      },
      {
        label: 'Contexto',
        text: 'Instalada na Universidade do Minho, Campus de Azurém, Guimarães.',
      },
    ],
  },
};

const DE_PROJECTS: Record<string, LocalizedProjectContent> = {
  livros: {
    categoryLine: 'SKULPTUR · TERRITORIALE MATERIALITÄT',
    medium: 'EICHENHOLZ · SKULPTUR',
    context: 'ZET GALLERY / 1986–2021',
    lead: 'Minimalistische Skulpturvolumen in Buchform. Rohes Holz und ruhiger Einschnitt begreifen Material als dauerhafte Aufzeichnung von Ort und Zeit.',
    steps: [
      {
        label: 'Material',
        text: 'Aus massiven, ortsgebundenen Holzblöcken geformt, unter Bewahrung von natürlicher Maserung, Rissen und Oberflächengewicht.',
      },
      {
        label: 'Form',
        text: 'Reduziert auf Geometrien offener und geschlossener Bücher, bei denen minimale Schnitte Rhythmus ohne ornamentale Geste setzen.',
      },
      {
        label: 'Kontext',
        text: '2021 entstanden und in der retrospektiven Monografie zu Volker Schnüttgens Werk von 1986 bis 2021 dokumentiert.',
      },
    ],
  },
  'o-bosque-trindade': {
    categoryLine: 'SKULPTUR & RAUMINSTALLATION',
    medium: 'EICHENHOLZ · INSTALLATION',
    context: 'RAUMAUSSTELLUNG · 2019',
    lead: 'Ein Feld vertikaler Eichenmonolithe im Raum verteilt. Die Installation markiert den Raum als einen zu entdeckenden Wald aus Zeichen.',
    steps: [
      {
        label: 'Material',
        text: 'Vertikale Eichenelemente mit zurückhaltenden Werkzeugspuren, sodass die rohe Holzdichte im vollen Körpermaßstab ablesbar bleibt.',
      },
      {
        label: 'Form',
        text: 'Gesetzt wie stehende Stämme oder megalithische Markierungen, die den Boden in symbolisches Territorium verwandeln.',
      },
      {
        label: 'Kontext',
        text: '2019 realisiert im Rahmen von Schnüttgens Raumforschung zwischen archaischer Waldimagination und zeitgenössischer Galeriearchitektur.',
      },
    ],
  },
  'abrigo-i-e-ii': {
    categoryLine: 'SKULPTUR · ARCHITEKTONISCHE FORM',
    medium: 'STEIN & EICHE · SKULPTUR',
    context: 'WERKPAAR · 2019',
    lead: 'Zwei gepaarte Skulpturen über Schutz und Schwelle. Schwerer Stein und Holz treffen in Formen aufeinander, die an archaische Dolmen erinnern.',
    steps: [
      {
        label: 'Material',
        text: 'Verbindet grob behauene Steinmasse und massive Holzbalken, rein durch Schwerkraft, Lagerung und Balance verankert.',
      },
      {
        label: 'Form',
        text: 'Knüpft direkt an die semiotische Klarheit megalithischer Dolmen an und schafft einen inneren Schattenraum und ruhige Zuflucht.',
      },
      {
        label: 'Kontext',
        text: '2019 als zwei korrespondierende Strukturen vollendet, die die Frage nach Behausung, Schutz und Ort fortführen.',
      },
    ],
  },
  'trilogia-de-um-carvalho': {
    categoryLine: 'SKULPTUR · EICHENHOLZ',
    medium: 'GESCHNITZTE EICHENSTÄMME',
    context: 'ATELIER SINTRA · 2011',
    lead: 'Drei monumentale Formen aus Eichenstämmen gehauen. Jedes Volumen registriert Wachstum, Gewicht und bewussten geometrischen Eingriff.',
    steps: [
      {
        label: 'Material',
        text: 'Massives Eichenholz aus der Region unter Respektierung von Aststellen, radialen Rissen und natürlicher Patina.',
      },
      {
        label: 'Form',
        text: 'Angeordnet als dreiteilige Sequenz, in der subtile Schnitte und plane Facetten einen Dialog über den Boden hinweg eröffnen.',
      },
      {
        label: 'Kontext',
        text: '2011 in Sintra entstanden und ein Schlüsselwerk in Volker Schnüttgens langjähriger Beschäftigung mit Eiche als Bildhauermaterial.',
      },
    ],
  },
  habitat: {
    categoryLine: 'INSTALLATION · EICHENSKULPTUREN, TANZ & KLANG',
    medium: 'EICHENSKULPTUR · INTERAKTIVE MEDIEN',
    context: 'LABORGRAS · RADIALSYSTEM V',
    lead: 'Eine begehbare Eicheninstallation, die Skulptur, Choreografie und Live-Klang vereint. Koproduziert mit dem Tanzkollektiv LaborGras.',
    steps: [
      {
        label: 'Material',
        text: 'Skulpturale Eichenarchitektur verbunden mit interaktiven Mediensystemen von Frieder Weiss und einem Soundscape von Giorgio de Santis.',
      },
      {
        label: 'Form',
        text: 'Wirkt zugleich als Skulptur, Performance-Bühne und gemeinsamer Raum-Lebensraum für Tänzer und Publikum.',
      },
      {
        label: 'Kontext',
        text: '2010 im Radialsystem V, Berlin, uraufgeführt – gefördert durch den Hauptstadtkulturfonds Berlin.',
      },
    ],
  },
  'espacos-virtuais': {
    categoryLine: 'SERIE · MEDIENKUNST & RAUMSTUDIE',
    medium: 'NEUE MEDIEN · RAUMSERIE',
    context: 'FBAUP MEDIENKUNST · 2008',
    lead: 'Eine achtteilige Serie, die eine Brücke zwischen physischer skulpturaler Wahrnehmung und virtuellen Raumumgebungen schlägt.',
    steps: [
      {
        label: 'Material',
        text: 'Digitale Raumstudien, geprägt durch Schnüttgens Berliner Weiterbildung in neuen Technologien 2004 mit Stipendium der Stiftung Calouste Gulbenkian.',
      },
      {
        label: 'Form',
        text: 'Gegliedert in acht aufeinanderfolgende Studien über Grenze, Licht und virtuelle Tiefe.',
      },
      {
        label: 'Kontext',
        text: '2008 parallel zu seinem Masterabschluss in Medienkunst an der FBAUP in Porto entwickelt.',
      },
    ],
  },
  pieta: {
    categoryLine: 'SKULPTUR · ARCHAISCHE FIGURATION',
    medium: 'SKULPTUR',
    context: 'EINZELWERK · 2007',
    lead: 'Archaische Figuration verdichtet zu ruhiger skulpturaler Masse. Antike Geste übersetzt in minimalistische Gegenwartsform.',
    steps: [
      {
        label: 'Material',
        text: 'Aus massiver Skulpturensubstanz gearbeitet mit höchster Aufmerksamkeit für Oberflächenübergänge und Kantenspannung.',
      },
      {
        label: 'Form',
        text: 'Zeichnet einen Weg von archaischer figurativer Erinnerung hin zu strenger geometrischer Abstraktion.',
      },
      {
        label: 'Kontext',
        text: '2007 während Volker Schnüttgens Atelierzeit in Sintra geschaffen.',
      },
    ],
  },
  'quadrado-negro': {
    categoryLine: 'SKULPTUR · GEOMETRISCHE REDUKTION',
    medium: 'SKULPTUR',
    context: 'EINZELWERK · 2007',
    lead: 'Ein strenges geometrisches Zeichen im Raum verankert. Minimalistisches Volumen reduziert auf reines Gewicht und Kontur.',
    steps: [
      {
        label: 'Material',
        text: 'Abgedunkelte Oberfläche und dichter Skulpturenkörper, der Masse über beschreibendes Detail stellt.',
      },
      {
        label: 'Form',
        text: 'Wirkt als visuelle Markierung und räumlicher Ankerpunkt innerhalb des Ausstellungsraums.',
      },
      {
        label: 'Kontext',
        text: '2007 als Teil von Schnüttgens reduktiven geometrischen Untersuchungen vollendet.',
      },
    ],
  },
  'alfabeto-escultorico': {
    categoryLine: 'SERIE · SEMIOTISCHE SKULPTUR',
    medium: 'SKULPTURENSERIE',
    context: 'SEMIOTISCHE SERIE · 2006',
    lead: 'Skulptur artikuliert als Grammatik der Zeichen. Einzelne Formen fügen sich wie Schriftzeichen einer archaischen Schrift.',
    steps: [
      {
        label: 'Material',
        text: 'Serie taktiler Studien, ausgeführt in natürlichen und strukturellen Bildhauermaterialien.',
      },
      {
        label: 'Form',
        text: 'Jedes Stück fungiert als eigenständige typografische Einheit innerhalb eines entzifferbaren Raumvokabulars.',
      },
      {
        label: 'Kontext',
        text: '2006 entstanden als Ausdruck seiner Auffassung von Skulptur als Muster, das ein Zeichen setzt.',
      },
    ],
  },
  'para-florbela-espanca': {
    categoryLine: 'SKULPTUR · HOMMAGE',
    medium: 'SKULPTUR',
    context: 'PORTUGAL · 1998',
    lead: 'Eine skulpturale Hommage an die portugiesische Dichterin Florbela Espanca. Poetische Zurückhaltung gefasst in stiller materieller Form.',
    steps: [
      {
        label: 'Material',
        text: 'Mit sorgfältiger handwerklicher Disziplin aus Stein- und Holztraditionen heraus gearbeitet.',
      },
      {
        label: 'Form',
        text: 'Minimalistische Silhouette, die einen kontemplativen Raum der Erinnerung und Ehrung eröffnet.',
      },
      {
        label: 'Kontext',
        text: '1998 in den ersten Jahren seines dauerhaften Lebens in Sintra realisiert.',
      },
    ],
  },
  satzzeichen: {
    categoryLine: 'SERIE · FÜNFTEILIGE SKULPTURENARBEIT',
    medium: 'FÜNFTEILIGE SKULPTURENSERIE',
    context: 'SERIE · 1997',
    lead: 'Fünf skulpturale Satzzeichen im Dialog mit der Architektur. Jedes Werk setzt eine Zäsur und bestimmt den Rhythmus.',
    steps: [
      {
        label: 'Material',
        text: 'Fünf physische Elemente mit klaren Kanten und taktilem Oberflächenkontrast.',
      },
      {
        label: 'Form',
        text: 'Wirkt buchstäblich als räumliche Interpunktion – teilt, verlangsamt und rahmt Bewegung im Raum.',
      },
      {
        label: 'Kontext',
        text: '1997 zwischen deutscher struktureller Strenge und portugiesischer Atelierpraxis vollendet.',
      },
    ],
  },
  'jogo-fatal': {
    categoryLine: 'SKULPTUR · ZWEITEILIGES WERK',
    medium: 'SKULPTUR',
    context: 'ZWEITEILIGER ZYKLUS · 1995–1997',
    lead: 'Ein zwischen 1995 und 1997 entwickelter zweiteiliger Skulpturenzyklus. Gegensätzliche Volumen halten physische Spannung im Gleichgewicht.',
    steps: [
      {
        label: 'Material',
        text: 'Dichte Materialien, geformt um strukturelle Belastung und Gegengewicht sichtbar zu machen.',
      },
      {
        label: 'Form',
        text: 'Zwei aufeinander bezogene Aussagen, die Gleichgewicht, Bruch und räumliche Konfrontation prüfen.',
      },
      {
        label: 'Kontext',
        text: 'Zwischen 1995 und 1997 nach seiner Übersiedlung nach Portugal entstanden.',
      },
    ],
  },
  'memoria-de-lisboa': {
    categoryLine: 'SKULPTUR · TERRITORIALES GEDÄCHTNIS',
    medium: 'SKULPTUR',
    context: 'PORTUGAL · 1995',
    lead: 'Eine frühe skulpturale Antwort auf Lissabons Licht, Stein und Stadthorizont, entstanden zwei Jahre nach der Ansiedlung in Sintra.',
    steps: [
      {
        label: 'Material',
        text: 'Gegründet auf rohem Stein und mineralischer Beständigkeit als Spiegel von Lissabons Kalk- und Granitgefüge.',
      },
      {
        label: 'Form',
        text: 'Kompakte architektonische Erinnerung verdichtet in minimalen skulpturalen Ebenen.',
      },
      {
        label: 'Kontext',
        text: '1995 nach Ankunft in Portugal mit einem Stipendium des portugiesischen Außenministeriums geschaffen.',
      },
    ],
  },
  'der-steinsetzer': {
    categoryLine: 'SKULPTUR · STEINARBEIT',
    medium: 'STEINSKULPTUR',
    context: 'FRÜHWERK · 1989',
    lead: 'Eine frühe Steinskulptur aus Deutschland. Erdverbundenes Gewicht und handbearbeiteter Stein legen das Fundament seiner späteren Formensprache.',
    steps: [
      {
        label: 'Material',
        text: 'Direkt mit Meißel, Hammer und Setzhand geformter Naturstein.',
      },
      {
        label: 'Form',
        text: 'Verankert den Akt des Steinsetzens – markiert Boden, Schwerkraft und menschliches Maß.',
      },
      {
        label: 'Kontext',
        text: '1989 im Anschluss an sein Studium der Bildhauerei und Grafik an der Hochschule für Künste Bremen ausgeführt.',
      },
    ],
  },
  'monumento-arvore-desconhecida': {
    categoryLine: 'SKULPTUR · TERRITORIALE MARKIERUNG',
    medium: 'HOLZ & STEIN · SKULPTUR',
    context: 'TERRITORIALES WERK',
    lead: 'Ein stilles Monument für einen unbekannten Baum. Skulptur wird zum ethischen Zeichen für natürliche Präsenz in der Landschaft.',
    steps: [
      {
        label: 'Material',
        text: 'Organisches Holz und regionaler Stein ohne Künstlichkeit zusammengeführt.',
      },
      {
        label: 'Form',
        text: 'Minimalistisches vertikales Zeichen, das einen intimen Ort des Innehaltens und Erinnerns schafft.',
      },
      {
        label: 'Kontext',
        text: 'Spiegelt Volker Schnüttgens wiederkehrenden Dialog mit Baumgedächtnis und ökologischem Bewusstsein.',
      },
    ],
  },
  'rosa-dos-ventos': {
    categoryLine: 'ORTSSKULPTUR · KÜNSTLERRESIDENZ',
    medium: 'ORTSPEZIFISCHE SKULPTUR',
    context: 'ALDEIA DO PONTIDO, FAFE',
    lead: 'Ortsskulptur während einer Künstlerresidenz in Aldeia do Pontido, Fafe, zur Ausrichtung der Himmelsrichtungen im Gelände.',
    steps: [
      {
        label: 'Material',
        text: 'Aus widerstandsfähigen Naturmaterialien passend für die exponierte ländliche Topografie Nordportugals gebaut.',
      },
      {
        label: 'Form',
        text: 'Übersetzt kardinalische Orientierung in ein zugängliches, entdeckbares skulpturales Zeichen.',
      },
      {
        label: 'Kontext',
        text: 'Unmittelbar hervorgegangen aus der Residenz des Künstlers in Aldeia do Pontido, Fafe.',
      },
    ],
  },
  'common-home': {
    categoryLine: 'ÖFFENTLICHES WERK · UNIVERSIDADE DO MINHO',
    medium: 'ÖFFENTLICHE SKULPTUR',
    context: 'CAMPUS DE AZURÉM, GUIMARÃES',
    lead: 'Permanentes Werk im öffentlichen Raum auf dem Campus de Azurém der Universidade do Minho. Ein archetypischer Schutzraum auf gemeinsamem Boden.',
    steps: [
      {
        label: 'Material',
        text: 'Monumentaler Naturstein und konstruktives Holz, proportioniert für dauerhafte Außenaufstellung auf dem Campus.',
      },
      {
        label: 'Form',
        text: 'Ruft das Bild einer offenen Schwelle und eines urtümlichen Hauses auf – ein symbolischer Treffpunkt für alle.',
      },
      {
        label: 'Kontext',
        text: 'Installiert an der Universidade do Minho, Campus de Azurém, Guimarães.',
      },
    ],
  },
};

export const FR_PROJECTS: Record<string, LocalizedProjectContent> = {
  livros: {
    categoryLine: 'SCULPTURE · MATÉRIALITÉ TERRITORIALE',
    medium: 'BOIS DE CHÊNE · SCULPTURE',
    context: 'ZET GALLERY / 1986–2021',
    lead: 'Volumes sculpturaux minimalistes en forme de livres. Le bois brut et l’incision mesurée traitent la matière comme un témoignage durable du lieu et du temps.',
    steps: [
      {
        label: 'Matière',
        text: 'Taillée dans des blocs de bois massif liés au territoire, en préservant le fil naturel, les fissures et le poids de surface.',
      },
      {
        label: 'Forme',
        text: 'Réduite à des géométries de livres ouverts et fermés où des coupes minimales instaurent un rythme sans geste ornemental.',
      },
      {
        label: 'Contexte',
        text: 'Créée en 2021 et documentée dans la monographie rétrospective consacrée à l’œuvre de Volker Schnüttgen entre 1986 et 2021.',
      },
    ],
  },
  'o-bosque-trindade': {
    categoryLine: 'SCULPTURE & INSTALLATION SPATIALE',
    medium: 'BOIS DE CHÊNE · INSTALLATION',
    context: 'EXPOSITION SPATIALE · 2019',
    lead: 'Un champ de monolithes verticaux en chêne répartis dans la salle. L’installation marque l’espace comme une forêt de signes à découvrir.',
    steps: [
      {
        label: 'Matière',
        text: 'Éléments verticaux en chêne travaillés avec des traces d’outils retenues afin que la densité du bois brut reste lisible à l’échelle du corps.',
      },
      {
        label: 'Forme',
        text: 'Espacés comme des troncs dressés ou des bornes mégalithiques, établissant un motif qui transforme le sol en territoire symbolique.',
      },
      {
        label: 'Contexte',
        text: 'Réalisée en 2019 dans le cadre des recherches spatiales de Schnüttgen entre imaginaire forestier ancestral et architecture de galerie.',
      },
    ],
  },
  'abrigo-i-e-ii': {
    categoryLine: 'SCULPTURE · FORME ARCHITECTONIQUE',
    medium: 'PIERRE & CHÊNE · SCULPTURE',
    context: 'ŒUVRES APPARIÉES · 2019',
    lead: 'Deux sculptures en dialogue sur l’abri et le seuil. Pierre massive et bois se rencontrent dans des formes évoquant les dolmens archaïques.',
    steps: [
      {
        label: 'Matière',
        text: 'Associe une masse de pierre brute et des poutres de bois massif ancrées uniquement par la gravité, l’appui et l’équilibre.',
      },
      {
        label: 'Forme',
        text: 'S’appuie directement sur la clarté sémiotique des dolmens mégalithiques — créant une ombre intérieure et un refuge spatial silencieux.',
      },
      {
        label: 'Contexte',
        text: 'Achevée en 2019 comme deux structures complémentaires prolongeant la réflexion de l’artiste sur l’habiter, la protection et le lieu.',
      },
    ],
  },
  'trilogia-de-um-carvalho': {
    categoryLine: 'SCULPTURE · BOIS DE CHÊNE',
    medium: 'TRONCS DE CHÊNE SCULPTÉS',
    context: 'ATELIER DE SINTRA · 2011',
    lead: 'Trois formes monumentales taillées dans des troncs de chêne. Chaque volume enregistre croissance, poids et intervention géométrique délibérée.',
    steps: [
      {
        label: 'Matière',
        text: 'Chêne massif issu du territoire local, respectant nœuds, fentes radiales et patine naturelle de surface.',
      },
      {
        label: 'Forme',
        text: 'Disposée en une séquence tripartite où des coupes subtiles et des facettes planes ouvrent un dialogue à travers le sol.',
      },
      {
        label: 'Contexte',
        text: 'Produite en 2011 à Sintra, marquant une œuvre clé dans la longue étude de Volker Schnüttgen sur le chêne comme médium sculptural.',
      },
    ],
  },
  habitat: {
    categoryLine: 'INSTALLATION · SCULPTURES EN CHÊNE, DANSE & SON',
    medium: 'SCULPTURE EN CHÊNE · MÉDIAS INTERACTIFS',
    context: 'LABORGRAS · RADIALSYSTEM V',
    lead: 'Une installation praticable en chêne unissant sculpture, chorégraphie et son en direct. Coproduite avec le collectif de danse LaborGras.',
    steps: [
      {
        label: 'Matière',
        text: 'Architecture sculpturale en chêne associée aux systèmes média interactifs de Frieder Weiss et au paysage sonore de Giorgio de Santis.',
      },
      {
        label: 'Forme',
        text: 'Fonctionne simultanément comme sculpture, scène de performance et habitat spatial partagé traversé par les danseurs et le public.',
      },
      {
        label: 'Contexte',
        text: 'Créée au Radialsystem V à Berlin en 2010 avec le soutien du Capital Berlin Cultural Fund.',
      },
    ],
  },
  'espacos-virtuais': {
    categoryLine: 'SÉRIE · ART MÉDIA & ÉTUDE SPATIALE',
    medium: 'NOUVEAUX MÉDIAS · SÉRIE SPATIALE',
    context: 'FBAUP ART MÉDIA · 2008',
    lead: 'Une série en huit volets reliant la perception sculpturale physique et les environnements spatiaux virtuels.',
    steps: [
      {
        label: 'Matière',
        text: 'Études spatiales numériques nourries par la formation de l’artiste aux nouvelles technologies à Berlin en 2004, grâce à une bourse Gulbenkian.',
      },
      {
        label: 'Forme',
        text: 'Articulée en huit études séquentielles examinant la limite, la lumière et la profondeur virtuelle.',
      },
      {
        label: 'Contexte',
        text: 'Développée en 2008 parallèlement à son Master en Art Multimédia à la FBAUP de Porto.',
      },
    ],
  },
  pieta: {
    categoryLine: 'SCULPTURE · FIGURATION ARCHAÏQUE',
    medium: 'SCULPTURE',
    context: 'ŒUVRE UNIQUE · 2007',
    lead: 'Figuration archaïque condensée en une masse sculpturale silencieuse. Le geste ancien traduit dans une forme contemporaine minimaliste.',
    steps: [
      {
        label: 'Matière',
        text: 'Taillée dans une masse sculpturale solide avec une grande rigueur sur les transitions de surface et la tension des arêtes.',
      },
      {
        label: 'Forme',
        text: 'Trace un chemin allant de la mémoire figurative archaïque vers une abstraction géométrique épurée.',
      },
      {
        label: 'Contexte',
        text: 'Créée en 2007 durant la période d’atelier de Volker Schnüttgen à Sintra.',
      },
    ],
  },
  'quadrado-negro': {
    categoryLine: 'SCULPTURE · RÉDUCTION GÉOMÉTRIQUE',
    medium: 'SCULPTURE',
    context: 'ŒUVRE UNIQUE · 2007',
    lead: 'Un signe géométrique austère ancré dans l’espace. Volume minimaliste réduit au pur poids et au contour.',
    steps: [
      {
        label: 'Matière',
        text: 'Surface assombrie et corps sculptural dense privilégiant la masse au détriment du détail descriptif.',
      },
      {
        label: 'Forme',
        text: 'Opère comme repère visuel et point d’ancrage spatial au sein de la salle d’exposition.',
      },
      {
        label: 'Contexte',
        text: 'Achevée en 2007 dans le cadre des recherches géométriques réductives de Schnüttgen.',
      },
    ],
  },
  'alfabeto-escultorico': {
    categoryLine: 'SÉRIE · SCULPTURE SÉMIOTIQUE',
    medium: 'SÉRIE DE SCULPTURES',
    context: 'SÉRIE SÉMIOTIQUE · 2006',
    lead: 'Sculpture articulée comme une grammaire de signes. Des formes individuelles s’assemblent tels les caractères d’une écriture ancestrale.',
    steps: [
      {
        label: 'Matière',
        text: 'Série d’études tactiles réalisées dans des matériaux sculpturaux naturels et structurels.',
      },
      {
        label: 'Forme',
        text: 'Chaque pièce agit comme une unité typographique distincte au sein d’un vocabulaire spatial à découvrir.',
      },
      {
        label: 'Contexte',
        text: 'Produite en 2006, incarnant sa vision de la sculpture comme motif établissant un signe.',
      },
    ],
  },
  'para-florbela-espanca': {
    categoryLine: 'SCULPTURE · ŒUVRE D’HOMMAGE',
    medium: 'SCULPTURE',
    context: 'PORTUGAL · 1998',
    lead: 'Un hommage sculptural dédié à la poétesse portugaise Florbela Espanca. Retenue poétique contenue dans une forme matérielle silencieuse.',
    steps: [
      {
        label: 'Matière',
        text: 'Façonnée avec une discipline manuelle attentive issue des traditions de la pierre et du bois.',
      },
      {
        label: 'Forme',
        text: 'Silhouette minimaliste créant un espace contemplatif de mémoire et de recueillement.',
      },
      {
        label: 'Contexte',
        text: 'Réalisée en 1998 durant les premières années d’installation permanente de l’artiste à Sintra.',
      },
    ],
  },
  satzzeichen: {
    categoryLine: 'SÉRIE · ŒUVRE SCULPTURALE EN CINQ PARTIES',
    medium: 'SÉRIE SCULPTURALE EN CINQ PARTIES',
    context: 'SÉRIE · 1997',
    lead: 'Cinq signes de ponctuation sculpturaux placés en dialogue avec l’architecture. Chaque pièce introduit pause et cadence.',
    steps: [
      {
        label: 'Matière',
        text: 'Cinq éléments physiques façonnés avec des arêtes nettes et un contraste tactile de surface.',
      },
      {
        label: 'Forme',
        text: 'Agit littéralement comme une ponctuation spatiale — divisant, ralentissant et cadrant le mouvement dans la salle.',
      },
      {
        label: 'Contexte',
        text: 'Achevée en 1997 entre rigueur structurelle allemande et pratique d’atelier au Portugal.',
      },
    ],
  },
  'jogo-fatal': {
    categoryLine: 'SCULPTURE · ŒUVRE EN DEUX PARTIES',
    medium: 'SCULPTURE',
    context: 'CYCLE EN DEUX PARTIES · 1995–1997',
    lead: 'Un cycle sculptural en deux volets développé entre 1995 et 1997. Des volumes opposés maintiennent la tension physique en équilibre.',
    steps: [
      {
        label: 'Matière',
        text: 'Matériaux denses façonnés pour révéler la contrainte structurelle et le contrepoids.',
      },
      {
        label: 'Forme',
        text: 'Deux propositions appariées éprouvant l’équilibre, la fracture et la confrontation spatiale.',
      },
      {
        label: 'Contexte',
        text: 'Produite entre 1995 et 1997 après son installation permanente au Portugal.',
      },
    ],
  },
  'memoria-de-lisboa': {
    categoryLine: 'SCULPTURE · MÉMOIRE TERRITORIALE',
    medium: 'SCULPTURE',
    context: 'PORTUGAL · 1995',
    lead: 'Une première réponse sculpturale à la lumière, à la pierre et à l’horizon urbain de Lisbonne, créée deux ans après son arrivée à Sintra.',
    steps: [
      {
        label: 'Matière',
        text: 'Ancrée dans la pierre brute et la permanence minérale reflétant le calcaire et le granit de Lisbonne.',
      },
      {
        label: 'Forme',
        text: 'Mémoire architecturale compacte comprimée en plans sculpturaux minimaux.',
      },
      {
        label: 'Contexte',
        text: 'Créée en 1995 après son arrivée au Portugal grâce à une bourse du ministère portugais des Affaires étrangères.',
      },
    ],
  },
  'der-steinsetzer': {
    categoryLine: 'SCULPTURE · TRAVAIL DE LA PIERRE',
    medium: 'SCULPTURE EN PIERRE',
    context: 'ŒUVRE DE JEUNESSE · 1989',
    lead: 'Une première œuvre en pierre réalisée en Allemagne. Poids ancré et pierre taillée à la main posent les bases de son langage ultérieur.',
    steps: [
      {
        label: 'Matière',
        text: 'Pierre taillée directement au ciseau, au maillet et posée à la main.',
      },
      {
        label: 'Forme',
        text: 'Ancre le geste du poseur de pierre — marquant le sol, la gravité et la mesure humaine.',
      },
      {
        label: 'Contexte',
        text: 'Exécutée en 1989 après ses études de sculpture et de gravure à l’Université des Arts de Brême.',
      },
    ],
  },
  'monumento-arvore-desconhecida': {
    categoryLine: 'SCULPTURE · REPÈRE TERRITORIAL',
    medium: 'BOIS & PIERRE · SCULPTURE',
    context: 'ŒUVRE TERRITORIALE',
    lead: 'Un monument silencieux dédié à un arbre inconnu. La sculpture devient un repère éthique honorant la présence naturelle dans le paysage.',
    steps: [
      {
        label: 'Matière',
        text: 'Bois organique et pierre territoriale réunis sans artifice.',
      },
      {
        label: 'Forme',
        text: 'Repère vertical minimaliste créant un lieu intime de pause et de reconnaissance.',
      },
      {
        label: 'Contexte',
        text: 'Reflète le dialogue récurrent de Volker Schnüttgen avec la mémoire arboricole et la conscience écologique.',
      },
    ],
  },
  'rosa-dos-ventos': {
    categoryLine: 'SCULPTURE IN SITU · RÉSIDENCE ARTISTIQUE',
    medium: 'SCULPTURE SITE-SPECIFIC',
    context: 'ALDEIA DO PONTIDO, FAFE',
    lead: 'Sculpture in situ créée lors d’une résidence artistique à Aldeia do Pontido, Fafe, orientant les points cardinaux sur le terrain.',
    steps: [
      {
        label: 'Matière',
        text: 'Construite avec des matériaux naturels durables adaptés à la topographie rurale exposée du nord du Portugal.',
      },
      {
        label: 'Forme',
        text: 'Traduit l’orientation cardinale en un signe sculptural accessible et à découvrir.',
      },
      {
        label: 'Contexte',
        text: 'Issue directement de la résidence de l’artiste à Aldeia do Pontido, Fafe.',
      },
    ],
  },
  'common-home': {
    categoryLine: 'ŒUVRE PUBLIQUE · UNIVERSIDADE DO MINHO',
    medium: 'SCULPTURE PUBLIQUE',
    context: 'CAMPUS DE AZURÉM, GUIMARÃES',
    lead: 'Œuvre publique permanente sur le campus d’Azurém de l’Universidade do Minho. Un abri archétypal marquant un sol civique partagé.',
    steps: [
      {
        label: 'Matière',
        text: 'Pierre naturelle monumentale et bois de structure proportionnés pour une implantation extérieure durable sur le campus.',
      },
      {
        label: 'Forme',
        text: 'Évoque un seuil ouvert et une maison ancestrale — un lieu de rencontre symbolique ouvert à tous.',
      },
      {
        label: 'Contexte',
        text: 'Installée à l’Universidade do Minho, Campus d’Azurém, Guimarães.',
      },
    ],
  },
};

const BASE_PROJECTS_BY_ID = new Map(PROJECTS.map((p) => [p.id, p]));

export function getLocalizedProject(
  project: ProjectItem,
  language: Language,
): ProjectItem {
  if (language === 'en') return project;

  const dbLoc =
    language === 'pt' || language === 'fr'
      ? project.translations?.[language]
      : undefined;

  const staticMap =
    language === 'pt'
      ? PT_PROJECTS
      : language === 'fr'
        ? FR_PROJECTS
        : DE_PROJECTS;
  const staticLoc = staticMap[project.id];
  const base = BASE_PROJECTS_BY_ID.get(project.id);

  if (!dbLoc && (!staticLoc || !base)) {
    return project;
  }

  const pickField = (
    dbValue: string | undefined,
    staticValue: string | undefined,
    liveValue: string,
    baseValue: string | undefined,
  ): string => {
    if (dbValue && dbValue.trim()) return dbValue.trim();
    if (staticValue && baseValue !== undefined && liveValue === baseValue) {
      return staticValue;
    }
    return liveValue;
  };

  const localizedSteps: [ProjectStep, ProjectStep, ProjectStep] = ([0, 1, 2] as const).map(
    (idx) => {
      const dbStep = dbLoc?.steps?.[idx];
      if (dbStep && dbStep.text && dbStep.text.trim()) {
        return {
          label: dbStep.label?.trim() || project.steps[idx].label,
          text: dbStep.text,
        };
      }
      const staticStep = staticLoc?.steps?.[idx];
      const baseStep = base?.steps?.[idx];
      if (
        staticStep &&
        baseStep &&
        project.steps[idx].label === baseStep.label &&
        project.steps[idx].text === baseStep.text
      ) {
        return staticStep;
      }
      return project.steps[idx];
    },
  ) as [ProjectStep, ProjectStep, ProjectStep];

  return {
    ...project,
    title: pickField(dbLoc?.title, staticLoc?.title, project.title, base?.title),
    categoryLine: pickField(
      dbLoc?.categoryLine,
      staticLoc?.categoryLine,
      project.categoryLine,
      base?.categoryLine,
    ),
    medium: pickField(dbLoc?.medium, staticLoc?.medium, project.medium, base?.medium),
    context: pickField(dbLoc?.context, staticLoc?.context, project.context, base?.context),
    lead: pickField(dbLoc?.lead, staticLoc?.lead, project.lead, base?.lead),
    steps: localizedSteps,
  };
}

