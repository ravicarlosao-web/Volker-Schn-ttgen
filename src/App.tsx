import { useCallback, useEffect, useState } from 'react';
import { AdminPage } from './components/AdminPage';
import { ContactFooterSection } from './components/ContactFooterSection';
import { ElevatorSidebar } from './components/ElevatorSidebar';
import { HeroSection } from './components/HeroSection';
import { IntroSplash } from './components/IntroSplash';
import { JournalDetailPage } from './components/JournalDetailPage';
import { JournalSection } from './components/JournalSection';
import {
  JournalArchiveModal,
  PrivacyModal,
  StartProjectModal,
} from './components/Modals';
import { PortfolioCataloguePage } from './components/PortfolioCataloguePage';
import { PracticeSection } from './components/PracticeSection';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ProjectsSection } from './components/ProjectsSection';
import { SeoHead } from './components/SeoHead';
import { StudioSection } from './components/StudioSection';
import { usePortfolioData } from './context/PortfolioDataContext';
import {
  ELEVATOR_FLOORS,
  type FloorItem,
  type JournalEntry,
  type PortfolioCategoryId,
  type ProjectItem,
} from './data/formtectureData';

export default function App() {
  const { projects, journalEntries } = usePortfolioData();
  const [activeFloor, setActiveFloor] = useState<FloorItem['id']>('index');
  const [catalogueCategory, setCatalogueCategory] =
    useState<PortfolioCategoryId | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showStartProject, setShowStartProject] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/admin');
  });
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.pathname.startsWith('/admin')) return false;
    const sp = new URLSearchParams(window.location.search);
    if (
      sp.has('work') ||
      sp.has('journal') ||
      sp.has('category') ||
      sp.get('portfolio') === 'all'
    ) {
      return false;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reducedMotion && window.scrollY < 40;
  });

  const syncStateFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) {
      setIsAdminRoute(true);
      return;
    }
    setIsAdminRoute(false);

    const sp = new URLSearchParams(window.location.search);
    const workParam = sp.get('work');
    const journalParam = sp.get('journal');
    const categoryParam = sp.get('category');
    const portfolioParam = sp.get('portfolio');

    if (workParam) {
      const match = projects.find((p) => p.id === workParam);
      if (match) {
        setSelectedEntry(null);
        setSelectedProject(match);
        setCatalogueCategory(null);
        return;
      }
    }

    if (journalParam) {
      const match = journalEntries.find((j) => j.id === journalParam);
      if (match) {
        setSelectedProject(null);
        setCatalogueCategory(null);
        setSelectedEntry(match);
        return;
      }
    }

    if (categoryParam) {
      setSelectedEntry(null);
      setSelectedProject(null);
      setCatalogueCategory(categoryParam);
      return;
    }

    if (portfolioParam === 'all') {
      setSelectedEntry(null);
      setSelectedProject(null);
      setCatalogueCategory('ALL');
      return;
    }

    setSelectedEntry(null);
    setSelectedProject(null);
    setCatalogueCategory(null);
  }, [projects, journalEntries]);

  useEffect(() => {
    syncStateFromUrl();
  }, [syncStateFromUrl]);

  useEffect(() => {
    const onPopState = () => {
      syncStateFromUrl();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [syncStateFromUrl]);

  const openAdminPage = useCallback(() => {
    setShowIntro(false);
    setShowAllEntries(false);
    setShowStartProject(false);
    setShowPrivacy(false);
    setIsAdminRoute(true);
    if (!window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const exitAdminPage = useCallback(() => {
    setIsAdminRoute(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Track which section is currently active in the viewport
  useEffect(() => {
    if (isAdminRoute) return;
    if (selectedEntry) {
      setActiveFloor('journal');
      return;
    }

    if (selectedProject || catalogueCategory !== null) {
      setActiveFloor('projects');
      return;
    }

    const floorIds = ELEVATOR_FLOORS.map((f) => f.id);

    const handleScroll = () => {
      const scrollMarker = window.scrollY + window.innerHeight * 0.36;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 48
      ) {
        setActiveFloor('contact');
        return;
      }

      let current: FloorItem['id'] = 'index';
      for (const id of floorIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMarker) {
          current = id;
        }
      }
      setActiveFloor(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute, selectedProject, catalogueCategory, selectedEntry]);

  const pushPortfolioSearch = useCallback((nextQuery: string) => {
    if (typeof window === 'undefined') return;
    const target = nextQuery ? `/${nextQuery}` : '/';
    if (window.location.pathname + window.location.search !== target) {
      window.history.pushState({}, '', target);
    }
  }, []);

  const openCataloguePage = useCallback(
    (categoryId: PortfolioCategoryId) => {
      setSelectedEntry(null);
      setSelectedProject(null);
      setCatalogueCategory(categoryId);
      setActiveFloor('projects');
      pushPortfolioSearch(
        categoryId === 'ALL'
          ? '?portfolio=all'
          : `?category=${encodeURIComponent(categoryId)}`,
      );
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [pushPortfolioSearch],
  );

  const openProjectPage = useCallback(
    (project: ProjectItem) => {
      setSelectedEntry(null);
      setSelectedProject(project);
      setActiveFloor('projects');
      pushPortfolioSearch(`?work=${encodeURIComponent(project.id)}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [pushPortfolioSearch],
  );

  const openEntryPage = useCallback(
    (entry: JournalEntry) => {
      setSelectedProject(null);
      setCatalogueCategory(null);
      setSelectedEntry(entry);
      setActiveFloor('journal');
      pushPortfolioSearch(`?journal=${encodeURIComponent(entry.id)}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [pushPortfolioSearch],
  );

  const scrollToFloor = useCallback(
    (floorId: FloorItem['id']) => {
      if (selectedProject || catalogueCategory !== null || selectedEntry) {
        if (floorId === 'contact') {
          const contactEl = document.getElementById('contact');
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        setSelectedProject(null);
        setCatalogueCategory(null);
        setSelectedEntry(null);
        pushPortfolioSearch('');
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(floorId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 40);
        });
        return;
      }

      if (floorId === 'index') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const el = document.getElementById(floorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [selectedProject, catalogueCategory, selectedEntry, pushPortfolioSearch],
  );

  const inSubPage =
    selectedProject !== null || catalogueCategory !== null || selectedEntry !== null;

  if (isAdminRoute) {
    return (
      <>
        <SeoHead
          isAdminRoute={true}
          catalogueCategory={null}
          selectedProject={null}
          selectedEntry={null}
        />
        <AdminPage onExit={exitAdminPage} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <SeoHead
        isAdminRoute={false}
        catalogueCategory={catalogueCategory}
        selectedProject={selectedProject}
        selectedEntry={selectedEntry}
      />
      <ElevatorSidebar
        activeFloor={activeFloor}
        onSelectFloor={scrollToFloor}
        delayReveal={showIntro}
      />

      <main className="md:pl-[88px] lg:pl-[96px]">
        {selectedEntry ? (
          <>
            <JournalDetailPage
              key={selectedEntry.id}
              entry={selectedEntry}
              onSelectEntry={openEntryPage}
              onOpenAllEntries={() => setShowAllEntries(true)}
            />
            <ContactFooterSection
              onSelectFloor={scrollToFloor}
              onOpenStartProject={() => setShowStartProject(true)}
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenAdmin={openAdminPage}
            />
          </>
        ) : selectedProject ? (
          <>
            <ProjectDetailPage
              key={selectedProject.id}
              project={selectedProject}
              onSelectProject={openProjectPage}
              onOpenAllProjects={() =>
                openCataloguePage(catalogueCategory ?? 'ALL')
              }
            />
            <ContactFooterSection
              onSelectFloor={scrollToFloor}
              onOpenStartProject={() => setShowStartProject(true)}
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenAdmin={openAdminPage}
            />
          </>
        ) : catalogueCategory !== null ? (
          <>
            <PortfolioCataloguePage
              activeCategory={catalogueCategory}
              onChangeCategory={(cat) => {
                setCatalogueCategory(cat);
                pushPortfolioSearch(
                  cat === 'ALL'
                    ? '?portfolio=all'
                    : `?category=${encodeURIComponent(cat)}`,
                );
              }}
              onSelectProject={openProjectPage}
            />
            <ContactFooterSection
              onSelectFloor={scrollToFloor}
              onOpenStartProject={() => setShowStartProject(true)}
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenAdmin={openAdminPage}
            />
          </>
        ) : (
          <>
            <div id="index" data-floor="index" className="h-0" aria-hidden="true" />
            <HeroSection hideWordmark={showIntro} />
            <div className="relative z-10 bg-white shadow-[0_-24px_64px_rgba(0,0,0,0.26)]">
              <ProjectsSection onSelectCategory={openCataloguePage} />
              <PracticeSection />
              <StudioSection />
              <JournalSection
                onSelectEntry={openEntryPage}
                onOpenAllEntries={() => setShowAllEntries(true)}
              />
              <ContactFooterSection
                onSelectFloor={scrollToFloor}
                onOpenStartProject={() => setShowStartProject(true)}
                onOpenPrivacy={() => setShowPrivacy(true)}
                onOpenAdmin={openAdminPage}
              />
            </div>
          </>
        )}
      </main>

      {showAllEntries && (
        <JournalArchiveModal
          onClose={() => setShowAllEntries(false)}
          onSelectEntry={(entry) => {
            setShowAllEntries(false);
            openEntryPage(entry);
          }}
        />
      )}

      {showStartProject && (
        <StartProjectModal onClose={() => setShowStartProject(false)} />
      )}

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      {showIntro && !inSubPage && (
        <IntroSplash onComplete={handleIntroComplete} />
      )}
    </div>
  );
}
