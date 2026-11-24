import { motion, useScroll, useTransform } from 'motion/react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';

interface HeroSectionProps {
  hideWordmark?: boolean;
}

export function HeroSection({ hideWordmark = false }: HeroSectionProps) {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].hero;
  const { heroImage } = usePortfolioData();
  const { scrollY } = useScroll();

  const photoScale = useTransform(scrollY, [0, 750], [1, 1.05]);
  const headerY = useTransform(scrollY, [0, 700], [0, -24]);
  const headerOpacity = useTransform(scrollY, [0, 650], [1, 0.3]);
  const shadeOpacity = useTransform(scrollY, [0, 700], [0, 0.4]);

  return (
    <section
      aria-label="Hero — Volker Schnüttgen"
      className="sticky top-0 z-0 h-[100svh] w-full bg-black text-white pt-[74px] md:pt-8 pb-20 lg:pb-28 px-5 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Full-Bleed Hero Photograph */}
      <motion.div
        style={{ scale: photoScale }}
        className="absolute inset-0 z-0 origin-center will-change-transform"
      >
        <ArchitecturalImage
          src={heroImage}
          alt="Volker Schnüttgen — sculptural and spatial study"
          fallbackTitle="VOLKER SCHNÜTTGEN — SINTRA"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Editorial Top Scrim for Eyebrow & Hollow Typography Contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/25"
        />
      </motion.div>

      {/* Progressive Depth Shade as Next Section Rises Up Over Hero */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: shadeOpacity }}
        className="pointer-events-none absolute inset-0 z-[5] bg-black"
      />

      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative z-10 max-w-[1320px] mx-auto will-change-transform"
      >
        {/* Top Eyebrow Bar (preserved original position) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 lg:pb-10">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white">
            {t.role}
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/80">
            {t.origin}
          </span>
        </div>

        {/* Full-Width Display Wordmark (Hollow / Outline Only) */}
        <h1
          data-hero-wordmark
          className={`inline-block w-fit font-medium uppercase tracking-[-0.04em] leading-[0.88] text-[clamp(1.7rem,6.9vw,6.75rem)] whitespace-nowrap select-none text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.88)] [filter:drop-shadow(0_2px_12px_rgba(0,0,0,0.35))] ${
            hideWordmark ? 'opacity-0' : 'opacity-100'
          }`}
        >
          VOLKER SCHNÜTTGEN
        </h1>
      </motion.div>
    </section>
  );
}
