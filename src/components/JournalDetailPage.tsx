import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { type JournalEntry } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedJournalEntry, UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { RevealBlock, RevealLine } from './RevealText';

interface JournalDetailPageProps {
  entry: JournalEntry;
  onSelectEntry: (entry: JournalEntry) => void;
  onOpenAllEntries: () => void;
}

export function JournalDetailPage({
  entry,
  onSelectEntry,
  onOpenAllEntries,
}: JournalDetailPageProps) {
  const { language } = useLanguage();
  const { journalEntries } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].journal;
  const loc = getLocalizedJournalEntry(entry, language);

  const currentIdx = journalEntries.findIndex((item) => item.id === entry.id);
  const nextEntry =
    journalEntries.length > 0
      ? journalEntries[(currentIdx >= 0 ? currentIdx + 1 : 0) % journalEntries.length]
      : entry;

  return (
    <article className="bg-white text-black pt-[74px] md:pt-8 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Category / Date Eyebrow Rule */}
        <RevealLine>
          <div className="flex items-center gap-5 pb-8 lg:pb-10">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black whitespace-nowrap">
              {t.categories[loc.category]}
            </span>
            <div className="h-px flex-1 bg-black/20" />
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#666666] tabular-nums whitespace-nowrap">
              {loc.date}
            </span>
          </div>
        </RevealLine>

        {/* Monumental Editorial Title */}
        <RevealLine delay={0.05}>
          <h1 className="font-normal text-black tracking-[-0.03em] leading-[1.01] text-[clamp(2.4rem,6.2vw,5.25rem)] max-w-[1040px] text-balance">
            {loc.title}
          </h1>
        </RevealLine>

        {/* Offset Lead Summary on Right */}
        <div className="mt-8 lg:mt-10 pb-10 border-b-2 border-black grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-start-7 lg:col-span-6">
            <RevealBlock delay={0.1}>
              <p className="text-[20px] sm:text-[24px] lg:text-[26px] leading-[1.34] font-normal tracking-[-0.015em] text-black">
                {loc.subtitle}
              </p>
            </RevealBlock>
          </div>
        </div>

        {/* Full-Width Exhibition / Publication Photograph */}
        <div className="mt-10 aspect-[16/9.6] w-full overflow-hidden bg-[#F2F2F2]">
          <ArchitecturalImage
            src={loc.image}
            alt={loc.title}
            fallbackTitle={loc.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2-Column Editorial Reading Layout: Left Meta Credit / Right Essay Body */}
        <div className="mt-14 lg:mt-16 pt-8 border-t border-black/20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Metadata Column */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <RevealLine>
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  {loc.creditLabel}
                </span>
              </RevealLine>
              <RevealLine delay={0.05} className="mt-2">
                <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-black leading-relaxed">
                  {loc.creditValue}
                </span>
              </RevealLine>
            </div>

            <div className="pt-6 border-t border-black/15">
              <RevealLine>
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  {loc.secondaryLabel}
                </span>
              </RevealLine>
              <RevealLine delay={0.05} className="mt-2">
                <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-black leading-relaxed">
                  {loc.secondaryValue}
                </span>
              </RevealLine>
            </div>
          </div>

          {/* Right Editorial Article Body */}
          <div className="lg:col-start-6 lg:col-span-7 space-y-6">
            {loc.introParagraphs.map((paragraph, idx) => (
              <RevealBlock key={idx} delay={idx * 0.06}>
                <p className="text-[16px] sm:text-[17px] leading-[1.68] text-[#262626]">
                  {paragraph}
                </p>
              </RevealBlock>
            ))}

            <div className="pt-6">
              <RevealLine>
                <h2 className="text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.08] font-normal tracking-[-0.025em] text-black">
                  {loc.largeHeading}
                </h2>
              </RevealLine>
              <RevealBlock delay={0.06} className="mt-5">
                <p className="text-[16px] sm:text-[17px] leading-[1.68] text-[#262626]">
                  {loc.largeHeadingText}
                </p>
              </RevealBlock>
            </div>

            <div className="pt-4">
              <RevealLine>
                <h3 className="text-[22px] sm:text-[26px] leading-[1.2] font-normal tracking-[-0.02em] text-black">
                  {loc.subHeading}
                </h3>
              </RevealLine>
              <RevealBlock delay={0.06} className="mt-3.5">
                <p className="text-[16px] sm:text-[17px] leading-[1.68] text-[#262626]">
                  {loc.subHeadingText}
                </p>
              </RevealBlock>
            </div>
          </div>
        </div>

        {/* Bottom Switcher Bar (Next entry / All entries) */}
        <div className="mt-20 lg:mt-24 pt-8 pb-12 border-t border-black/20 flex flex-wrap items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => onSelectEntry(nextEntry)}
            className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/45 text-[22px] sm:text-[26px] font-normal tracking-[-0.02em] text-black hover:opacity-70 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.nextEntry}</span>
            <ArrowDownRight className="w-5 h-5" strokeWidth={1.25} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenAllEntries}
            className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/45 text-[22px] sm:text-[26px] font-normal tracking-[-0.02em] text-black hover:opacity-70 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.allEntriesLink}</span>
            <ArrowRight className="w-5 h-5" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
