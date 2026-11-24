import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  type PortfolioCategoryId,
  type PortfolioCategoryItem,
} from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedCategory, UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { RevealLine } from './RevealText';

interface ProjectsSectionProps {
  onSelectCategory: (categoryId: PortfolioCategoryId) => void;
}

interface CategoryRowProps {
  category: PortfolioCategoryItem;
  onSelectCategory: (categoryId: PortfolioCategoryId) => void;
}

function CategoryRow({ category, onSelectCategory }: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start 0.98', 'start 0.62'],
  });

  const rowY = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const rowOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const imageClip = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(20% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div ref={rowRef} className="relative z-0">
      <button
        type="button"
        onClick={() => onSelectCategory(category.id)}
        className="relative w-full text-left py-9 lg:py-11 px-2 sm:px-3 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group cursor-pointer bg-white hover:bg-black transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-black"
      >
        {/* Index Code */}
        <motion.div style={{ y: rowY, opacity: rowOpacity }} className="md:col-span-2">
          <span className="text-[38px] lg:text-[46px] leading-none font-normal tracking-[-0.02em] text-black group-hover:text-white group-hover:translate-x-3 tabular-nums inline-block transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {category.code}
          </span>
        </motion.div>

        {/* Category Title & Metadata */}
        <motion.div
          style={{ y: rowY, opacity: rowOpacity }}
          className="md:col-span-5"
        >
          <div className="md:group-hover:translate-x-1.5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <h3 className="text-[26px] lg:text-[32px] leading-[1.15] font-normal tracking-[-0.02em] text-black group-hover:text-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {category.title}
            </h3>
            <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#262626] group-hover:text-white/85 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {category.categoryLine}
            </p>
            <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666] group-hover:text-white/65 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {category.metaLine}
            </p>
          </div>
        </motion.div>

        {/* Directional Arrow (rotates smoothly from ↗ to → on hover) */}
        <motion.div
          style={{ y: rowY, opacity: rowOpacity }}
          className="md:col-span-1 flex md:justify-center"
        >
          <ArrowUpRight
            strokeWidth={1.25}
            className="w-5 h-5 text-black group-hover:text-white group-hover:rotate-45 group-hover:translate-x-1.5 transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            aria-hidden="true"
          />
        </motion.div>

        {/* Scroll-Entering Full-Color Category Photograph (Vertical Rectangular 3:4) */}
        <div className="md:col-span-4 flex md:justify-end md:group-hover:-translate-x-3 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <motion.div
            style={{ clipPath: imageClip }}
            className="aspect-[3/4] w-full max-w-[300px] md:max-w-[240px] lg:max-w-[265px] overflow-hidden bg-[#F2F2F2] group-hover:bg-[#171717] transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <motion.div style={{ scale: imageScale }} className="w-full h-full">
              <ArchitecturalImage
                src={category.image}
                alt={`${category.title} — Volker Schnüttgen`}
                fallbackTitle={category.title}
                className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </button>
    </div>
  );
}

export function ProjectsSection({ onSelectCategory }: ProjectsSectionProps) {
  const { language } = useLanguage();
  const { categories } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].portfolio;

  return (
    <section
      id="projects"
      data-floor="projects"
      className="bg-white text-black pt-6 lg:pt-8 pb-20 lg:pb-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Sticky Pinned Header: stays locked at top while categories scroll upward behind it */}
        <div className="sticky top-[50px] md:top-0 z-20 bg-white pt-10 lg:pt-14 pb-6 lg:pb-7 border-b-2 border-black">
          {/* Eyebrow Rule */}
          <RevealLine>
            <div className="flex items-center gap-5">
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black whitespace-nowrap">
                {t.eyebrow}
              </span>
              <div className="h-px flex-1 bg-black/20" />
              <span className="font-mono text-[11px] tracking-[0.08em] text-[#666666] tabular-nums">
                +96.00
              </span>
            </div>
          </RevealLine>

          {/* Section Title & Subtitle */}
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <RevealLine delay={0.05}>
              <h2 className="text-[42px] sm:text-[54px] lg:text-[62px] leading-[1.02] font-normal tracking-[-0.025em] text-black">
                {t.title}
              </h2>
            </RevealLine>
            <RevealLine delay={0.12}>
              <p className="text-[14px] leading-[1.45] text-[#595959] max-w-[295px]">
                {t.subtitle}
              </p>
            </RevealLine>
          </div>
        </div>

        {/* Artist Category Rows scrolling beneath the sticky header */}
        <div className="relative z-0 divide-y divide-black/15 border-b border-black/15">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={getLocalizedCategory(category, language)}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>

        {/* All Works Button */}
        <div className="mt-9">
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className="inline-flex items-center gap-3 border border-black/35 px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.allWorksBtn}</span>
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
