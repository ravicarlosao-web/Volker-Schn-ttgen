import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';

interface HeroSectionProps {
  hideWordmark?: boolean;
}

const SLIDE_INTERVAL_MS = 5500;
const FADE_DURATION_S = 1.6;

export function HeroSection({ hideWordmark = false }: HeroSectionProps) {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].hero;
  const { heroImage, heroImages } = usePortfolioData();
  const { scrollY } = useScroll();

  const slides = useMemo(() => {
    const valid = heroImages.filter((u) => Boolean(u && u.trim()));
    return valid.length > 0 ? valid : [heroImage];
  }, [heroImages, heroImage]);

  const [slideState, setSlideState] = useState<{ active: number; prev: number }>({
    active: 0,
    prev: 0,
  });

  useEffect(() => {
    setSlideState({ active: 0, prev: 0 });
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setSlideState((curr) => {
        const next = (curr.active + 1) % slides.length;
        return { active: next, prev: curr.active };
      });
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const photoScale = useTransform(scrollY, [0, 750], [1, 1.05]);
  const headerY = useTransform(scrollY, [0, 700], [0, -24]);
  const headerOpacity = useTransform(scrollY, [0, 650], [1, 0.3]);
  const shadeOpacity = useTransform(scrollY, [0, 700], [0, 0.4]);

  return (
    <section
      aria-label="Hero — Volker Schnüttgen"
      className="sticky top-0 z-0 h-[100svh] w-full bg-black text-white pt-[74px] md:pt-8 pb-20 lg:pb-28 px-5 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Full-Bleed Hero Photograph Crossfade Slideshow */}
      <motion.div
        style={{ scale: photoScale }}
        className="absolute inset-0 z-0 origin-center will-change-transform bg-black"
      >
        {slides.map((src, idx) => {
          const isActive = idx === slideState.active;
          const isPrev = idx === slideState.prev && idx !== slideState.active;
          return (
            <motion.div
              key={`${src}-${idx}`}
              initial={false}
              animate={{
                opacity: isActive || isPrev ? 1 : 0,
              }}
              transition={{
                duration: isActive ? FADE_DURATION_S : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
              }}
              aria-hidden={!isActive}
              className="absolute inset-0 will-change-[opacity]"
            >
              <ArchitecturalImage
                src={src}
                alt={`Volker Schnüttgen — sculptural and spatial study ${idx + 1}`}
                fallbackTitle="VOLKER SCHNÜTTGEN — SINTRA"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          );
        })}
        {/* Subtle Editorial Top Scrim for Eyebrow & Hollow Typography Contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] bg-gradient-to-b from-black/45 via-black/15 to-black/25 pointer-events-none"
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
