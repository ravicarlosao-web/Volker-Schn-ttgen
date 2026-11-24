import { ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  type PortfolioCategoryId,
  type ProjectItem,
} from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedProject } from '../i18n/projectTranslations';
import { getCategoryFilterLabel, UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { RevealBlock, RevealLine } from './RevealText';

interface PortfolioCataloguePageProps {
  activeCategory: PortfolioCategoryId;
  onChangeCategory: (categoryId: PortfolioCategoryId) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export function PortfolioCataloguePage({
  activeCategory,
  onChangeCategory,
  onSelectProject,
}: PortfolioCataloguePageProps) {
  const { language } = useLanguage();
  const { categories, projects } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].portfolio;

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const filterTabs: Array<{ id: PortfolioCategoryId; label: string }> = [
    { id: 'ALL', label: getCategoryFilterLabel('ALL', language) },
    ...categories.map((cat) => ({
      id: cat.id,
      label: getCategoryFilterLabel(cat.id, language, cat.title, cat),
    })),
  ];

  const filteredWorks = (
    activeCategory === 'ALL'
      ? projects
      : projects.filter((p) => p.portfolioCategory === activeCategory)
  ).map((p) => getLocalizedProject(p, language));

  const leadWork = filteredWorks[0];
  const gridWorks = filteredWorks.slice(1);

  return (
    <article className="bg-white text-black pt-[74px] md:pt-8 pb-20 lg:pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Eyebrow Rule */}
        <RevealLine>
          <div className="flex items-center gap-5 pb-8 lg:pb-10">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black whitespace-nowrap">
              {t.catalogueEyebrow}
            </span>
            <div className="h-px flex-1 bg-black/20" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#666666] tabular-nums">
              +96.00
            </span>
          </div>
        </RevealLine>

        {/* Monumental Title + Right Subtitle + Bottom 2px Rule */}
        <div className="pb-10 border-b-2 border-black flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <RevealLine delay={0.05}>
            <h1 className="font-normal text-black tracking-[-0.03em] leading-[0.98] text-[clamp(3.25rem,8vw,6.25rem)]">
              {t.title}
            </h1>
          </RevealLine>
          <RevealBlock delay={0.12} className="lg:max-w-[400px]">
            <p className="text-[18px] sm:text-[21px] leading-[1.35] font-normal tracking-[-0.015em] text-[#262626]">
              {t.catalogueSubtitle}
            </p>
          </RevealBlock>
        </div>

        {/* Sharp Architectural Category Filter Buttons */}
        <div className="mt-7 pb-10 lg:pb-12 flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeCategory(tab.id)}
                className={`px-4 py-2.5 font-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase border transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black/25 hover:border-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Lead Full-Width Work Card */}
        {leadWork && (
          <button
            type="button"
            onClick={() => onSelectProject(leadWork)}
            className="w-full text-left group cursor-pointer block focus-visible:outline-2 focus-visible:outline-black"
          >
            <div className="aspect-[16/9] lg:aspect-[16/8.6] w-full overflow-hidden bg-[#F2F2F2]">
              <ArchitecturalImage
                src={leadWork.image}
                alt={`${leadWork.title} (${leadWork.year})`}
                fallbackTitle={leadWork.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>

            <div className="pt-5 pb-12 border-b border-black/15">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666] tabular-nums">
                  {leadWork.floor}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
                  {getCategoryFilterLabel(
                    leadWork.portfolioCategory,
                    language,
                    categoryMap.get(leadWork.portfolioCategory)?.title,
                    categoryMap.get(leadWork.portfolioCategory),
                  )}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-4">
                <RevealLine className="flex-1 min-w-0">
                  <h2 className="text-[28px] sm:text-[36px] leading-[1.1] font-normal tracking-[-0.02em] text-black group-hover:opacity-75 transition-opacity">
                    {leadWork.title}
                  </h2>
                </RevealLine>
                <ArrowUpRight
                  className="w-5 h-5 text-black shrink-0 group-hover:rotate-45 group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-6">
                  <RevealLine delay={0.05}>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
                      {leadWork.location} &nbsp;·&nbsp; {leadWork.year}
                    </span>
                  </RevealLine>
                </div>
                <div className="lg:col-span-6">
                  <RevealBlock delay={0.08}>
                    <p className="text-[15px] leading-[1.5] text-[#262626] max-w-[460px]">
                      {leadWork.lead}
                    </p>
                  </RevealBlock>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Secondary Works in 2-Column Editorial Grid */}
        {gridWorks.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {gridWorks.map((work, idx) => (
              <button
                key={work.id}
                type="button"
                onClick={() => onSelectProject(work)}
                className="w-full text-left group cursor-pointer flex flex-col focus-visible:outline-2 focus-visible:outline-black"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#F2F2F2]">
                  <ArchitecturalImage
                    src={work.image}
                    alt={`${work.title} (${work.year})`}
                    fallbackTitle={work.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>

                <div className="pt-4 pb-6 border-b border-black/15 flex-1 flex flex-col justify-between w-full">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666] tabular-nums">
                      {work.floor}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
                      {getCategoryFilterLabel(
                        work.portfolioCategory,
                        language,
                        categoryMap.get(work.portfolioCategory)?.title,
                        categoryMap.get(work.portfolioCategory),
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <RevealLine delay={(idx % 2) * 0.06} className="flex-1 min-w-0">
                      <h3 className="text-[24px] sm:text-[28px] leading-[1.15] font-normal tracking-[-0.02em] text-black group-hover:opacity-75 transition-opacity">
                        {work.title}
                      </h3>
                    </RevealLine>
                    <ArrowUpRight
                      className="w-4 h-4 text-black shrink-0 group-hover:rotate-45 group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      strokeWidth={1.25}
                      aria-hidden="true"
                    />
                  </div>

                  <RevealLine delay={(idx % 2) * 0.06 + 0.05} className="mt-3">
                    <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
                      {work.location} &nbsp;·&nbsp; {work.year}
                    </span>
                  </RevealLine>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
