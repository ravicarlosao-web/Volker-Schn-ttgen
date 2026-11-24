import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MODEL_IMAGE, STUDIO_STATS } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedStudioStats, UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { CountUpStat, RevealBlock, RevealLine } from './RevealText';

export function StudioSection() {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].studio;
  const localizedStats = getLocalizedStudioStats(STUDIO_STATS, language);

  const stageRef = useRef<HTMLDivElement>(null);
  const [manualClosed, setManualClosed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.95', 'center 0.55'],
  });

  const sideBarWidth = useTransform(scrollYProgress, [0, 1], ['50%', '16%']);

  return (
    <section
      id="studio"
      data-floor="studio"
      className="bg-black text-white py-20 lg:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Eyebrow Rule */}
        <RevealLine>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white whitespace-nowrap">
              {t.eyebrow}
            </span>
            <div className="h-px flex-1 bg-white/25" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#A3A3A3] tabular-nums">
              ±0.00
            </span>
          </div>
        </RevealLine>

        {/* Section Header */}
        <div className="mt-8 pb-7 border-b-2 border-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <RevealLine delay={0.05}>
            <h2 className="text-[42px] sm:text-[54px] lg:text-[62px] leading-[1.02] font-normal tracking-[-0.025em] text-white">
              {t.title}
            </h2>
          </RevealLine>
          <RevealLine delay={0.12}>
            <p className="text-[14px] leading-[1.45] text-[#A3A3A3] max-w-[280px]">
              {t.subtitle}
            </p>
          </RevealLine>
        </div>

        {/* Official Biography Statement */}
        <RevealBlock delay={0.08}>
          <p className="mt-10 lg:mt-12 text-[22px] sm:text-[28px] lg:text-[34px] leading-[1.24] tracking-[-0.02em] font-normal text-white max-w-[880px] text-balance">
            {t.bio}
          </p>
        </RevealBlock>

        {/* 4-Column Factual Milestones with Numeric Count-Up */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {localizedStats.map((stat, idx) => (
            <div key={stat.value} className="border-t border-white/20 pt-4">
              <div className="flex items-baseline">
                <span className="text-[38px] sm:text-[46px] leading-none font-normal tracking-[-0.025em] text-white tabular-nums">
                  <CountUpStat value={stat.value} delay={idx * 0.08} />
                </span>
                {stat.unit && (
                  <span className="ml-1.5 text-[15px] font-normal uppercase text-white">
                    {stat.unit}
                  </span>
                )}
              </div>
              <RevealLine delay={idx * 0.06} className="mt-4">
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#A3A3A3]">
                  {stat.label}
                </p>
              </RevealLine>
            </div>
          ))}
        </div>

        {/* Shutter Reveal Stage */}
        <div className="mt-12 lg:mt-14">
          <div
            ref={stageRef}
            onClick={() => setManualClosed((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setManualClosed((prev) => !prev);
              }
            }}
            aria-label={manualClosed ? t.openShuttersAria : t.closeShuttersAria}
            className="relative w-full aspect-[16/8.2] min-h-[300px] sm:min-h-[430px] bg-black border border-white/20 overflow-hidden select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            {/* Centered Scale Study Image */}
            <div className="absolute inset-0 flex items-center justify-center px-[16%]">
              <ArchitecturalImage
                src={MODEL_IMAGE}
                alt="Volker Schnüttgen studio scale and spatial model study in Sintra"
                fallbackTitle="VOLKER SCHNÜTTGEN — SINTRA STUDIO"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Left Curtain Panel */}
            <motion.div
              style={{ width: manualClosed ? '50%' : sideBarWidth }}
              className="absolute left-0 top-0 bottom-0 bg-black border-r border-white/60 flex items-end justify-end p-4 sm:p-5 overflow-hidden"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white whitespace-nowrap">
                {t.groundFloor}
              </span>
            </motion.div>

            {/* Right Curtain Panel */}
            <motion.div
              style={{ width: manualClosed ? '50%' : sideBarWidth }}
              className="absolute right-0 top-0 bottom-0 bg-black border-l border-white/60 flex items-end justify-start p-4 sm:p-5 overflow-hidden"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-white tabular-nums whitespace-nowrap">
                ±0.00
              </span>
            </motion.div>
          </div>

          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-[#A3A3A3]">
            {t.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
