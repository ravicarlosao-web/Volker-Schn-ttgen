import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  HERO_IMAGE,
  HERO_IMAGES,
  JOURNAL_ENTRIES,
  MODEL_IMAGE,
  PORTFOLIO_CATEGORIES,
  PRACTICE_IMAGE,
  PROJECTS,
  type JournalEntry,
  type PortfolioCategoryItem,
  type ProjectItem,
} from '../data/formtectureData';

interface PortfolioPayload {
  heroImage: string;
  heroImages: string[];
  practiceImage: string;
  modelImage: string;
  categories: PortfolioCategoryItem[];
  projects: ProjectItem[];
  journalEntries: JournalEntry[];
}

interface PortfolioDataContextValue extends PortfolioPayload {
  loading: boolean;
  refreshPortfolio: () => Promise<void>;
}

const DEFAULT_PAYLOAD: PortfolioPayload = {
  heroImage: HERO_IMAGE,
  heroImages: HERO_IMAGES,
  practiceImage: PRACTICE_IMAGE,
  modelImage: MODEL_IMAGE,
  categories: PORTFOLIO_CATEGORIES,
  projects: PROJECTS,
  journalEntries: JOURNAL_ENTRIES,
};

const PortfolioDataContext = createContext<PortfolioDataContextValue>({
  ...DEFAULT_PAYLOAD,
  loading: false,
  refreshPortfolio: async () => {},
});

export function PortfolioDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<PortfolioPayload>(DEFAULT_PAYLOAD);
  const [loading, setLoading] = useState(false);

  const refreshPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as Partial<PortfolioPayload>;
      const resolvedHeroImages = Array.isArray(json.heroImages)
        ? json.heroImages.filter(
            (u): u is string => typeof u === 'string' && u.trim().length > 0,
          )
        : [];
      const fallbackSingleHero =
        typeof json.heroImage === 'string' && json.heroImage
          ? json.heroImage
          : HERO_IMAGE;
      const heroImages =
        resolvedHeroImages.length > 0 ? resolvedHeroImages : [fallbackSingleHero];

      setData({
        heroImage: heroImages[0] || fallbackSingleHero,
        heroImages,
        practiceImage:
          typeof json.practiceImage === 'string' && json.practiceImage
            ? json.practiceImage
            : PRACTICE_IMAGE,
        modelImage:
          typeof json.modelImage === 'string' && json.modelImage
            ? json.modelImage
            : MODEL_IMAGE,
        categories: Array.isArray(json.categories)
          ? json.categories
          : PORTFOLIO_CATEGORIES,
        projects: Array.isArray(json.projects) ? json.projects : PROJECTS,
        journalEntries: Array.isArray(json.journalEntries)
          ? json.journalEntries
          : JOURNAL_ENTRIES,
      });
    } catch {
      // Retain default data cleanly if API is temporarily unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPortfolio();
  }, [refreshPortfolio]);

  return (
    <PortfolioDataContext.Provider
      value={{
        ...data,
        loading,
        refreshPortfolio,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData(): PortfolioDataContextValue {
  return useContext(PortfolioDataContext);
}
