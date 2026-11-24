import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PRACTICE_DISCIPLINES } from '../data/formtectureData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { RevealBlock, RevealLine } from './RevealText';

export function PracticeSection() {
  const { language } = useLanguage();
  const { practiceImage } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].practice;
  const [openId, setOpenId] = useState<string>('sculpture');

  const toggleDiscipline = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="practice"
      data-floor="practice"
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
              +4.20
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

        {/* 2-Column Split: Studio Study + Disciplines Accordion */}
        <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Spatial Study Photo */}
          <div className="lg:col-span-6">
            <RevealBlock>
              <div className="aspect-[4/4.1] w-full overflow-hidden bg-[#F2F2F2]">
                <ArchitecturalImage
                  src={practiceImage}
                  alt="Sculptor studio workbench with carved oak wood, granite stone and tools"
                  fallbackTitle="PRACTICE — SCULPTURE & SPACE"
                  className="w-full h-full object-cover"
                />
              </div>
            </RevealBlock>
          </div>

          {/* 5-Discipline Accordion */}
          <div className="lg:col-span-6 border-t border-black/20">
            {PRACTICE_DISCIPLINES.map((item, idx) => {
              const isOpen = openId === item.id;
              const loc = t.disciplines[item.id] ?? item;
              return (
                <div key={item.id} className="border-b border-black/20">
                  <button
                    type="button"
                    onClick={() => toggleDiscipline(item.id)}
                    aria-expanded={isOpen}
                    className="w-full py-6 lg:py-7 flex items-center justify-between gap-4 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
                  >
                    <RevealLine delay={idx * 0.05} className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-6 sm:gap-10">
                        <span className="font-mono text-[11px] tracking-[0.1em] text-[#666666] tabular-nums w-10 shrink-0">
                          {item.code}
                        </span>
                        <span className="text-[24px] sm:text-[30px] leading-tight font-normal tracking-[-0.02em] text-black group-hover:opacity-75 transition-opacity">
                          {loc.title}
                        </span>
                      </div>
                    </RevealLine>

                    <span className="text-black shrink-0" aria-hidden="true">
                      {isOpen ? (
                        <X className="w-5 h-5" strokeWidth={1.25} />
                      ) : (
                        <Plus
                          className="w-5 h-5 text-[#666666] group-hover:text-black transition-colors"
                          strokeWidth={1.25}
                        />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="pb-7 pl-16 sm:pl-20 pr-6"
                    >
                      <p className="text-[15px] leading-[1.58] text-[#262626] max-w-[460px]">
                        {loc.description}
                      </p>
                      <p className="mt-5 font-mono text-[10px] sm:text-[11px] tracking-[0.13em] uppercase text-[#666666]">
                        {loc.tags.join('  ·  ')}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
