import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  HERO_IMAGE,
  JOURNAL_ENTRIES,
  PORTFOLIO_CATEGORIES,
  PROJECTS,
  type JournalEntry,
  type PortfolioCategoryItem,
  type ProjectItem,
} from '../data/formtectureData';

interface PortfolioPayload {
  heroImage: string;
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
      const res = await fetch('/api/portfolio');
      if (!res.ok) return;
      const json = (await res.json()) as Partial<PortfolioPayload>;
      setData({
        heroImage:
          typeof json.heroImage === 'string' && json.heroImage
            ? json.heroImage
            : HERO_IMAGE,
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
