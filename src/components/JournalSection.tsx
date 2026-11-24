import { ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { type JournalEntry } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedJournalEntry, UI_TRANSLATIONS } from '../i18n/translations';
import { RevealLine } from './RevealText';

interface JournalSectionProps {
  onSelectEntry: (entry: JournalEntry) => void;
  onOpenAllEntries: () => void;
}

export function JournalSection({
  onSelectEntry,
  onOpenAllEntries,
}: JournalSectionProps) {
  const { language } = useLanguage();
  const { journalEntries } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].journal;

  const featuredEntries = journalEntries.filter((entry) => entry.featured);

  return (
    <section
      id="journal"
      data-floor="journal"
      className="bg-white text-black py-20 lg:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Eyebrow Rule */}
        <RevealLine>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black whitespace-nowrap">
              {t.eyebrow}
            </span>
            <div className="h-px flex-1 bg-black/20" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#666666] tabular-nums">
              -3.60
            </span>
          </div>
        </RevealLine>

        {/* Section Header */}
        <div className="mt-8 pb-7 border-b-2 border-black flex flex-col md:flex-row md:items-end justify-between gap-4">
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

        {/* 3 Real Exhibition & Publication Rows */}
        <div className="divide-y divide-black/15 border-b border-black/15">
          {featuredEntries.map((entry, idx) => {
            const loc = getLocalizedJournalEntry(entry, language);
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelectEntry(entry)}
                className="w-full text-left py-7 lg:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline md:items-center group cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
              >
                <div className="md:col-span-2">
                  <RevealLine delay={idx * 0.04}>
                    <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-[#262626] tabular-nums">
                      {loc.date}
                    </span>
                  </RevealLine>
                </div>

                <div className="md:col-span-2">
                  <RevealLine delay={idx * 0.04 + 0.03}>
                    <span className="block font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
                      {t.categories[entry.category]}
                    </span>
                  </RevealLine>
                </div>

                <div className="md:col-span-7">
                  <RevealLine delay={idx * 0.05 + 0.05}>
                    <h3 className="text-[22px] sm:text-[26px] lg:text-[28px] leading-[1.2] font-normal tracking-[-0.02em] text-black group-hover:opacity-75 transition-opacity">
                      {loc.title}
                    </h3>
                  </RevealLine>
                </div>

                <div className="md:col-span-1 flex md:justify-end">
                  <ArrowUpRight
                    strokeWidth={1.25}
                    className="w-5 h-5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* All Entries Button */}
        <div className="mt-9">
          <button
            type="button"
            onClick={onOpenAllEntries}
            className="inline-flex items-center gap-3 border border-black/35 px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.allEntriesBtn}</span>
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
