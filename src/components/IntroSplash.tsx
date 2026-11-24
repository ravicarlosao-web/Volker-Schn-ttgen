import { useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'motion/react';

interface IntroSplashProps {
  onComplete: () => void;
}

interface IntroMetrics {
  top: number;
  left: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
  slideEndX: number;
}

const HOLD_DELAY = 1.9;

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [metrics, setMetrics] = useState<IntroMetrics | null>(null);

  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const measure = () => {
      const targetEl = document.querySelector<HTMLElement>('[data-hero-wordmark]');
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sidebarWidth = vw >= 1024 ? 96 : vw >= 768 ? 88 : 0;

      setMetrics({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        startX: vw / 2 - (rect.left + rect.width / 2),
        startY: vh / 2 - (rect.top + rect.height / 2),
        slideEndX: -(vw - sidebarWidth),
      });
    };

    measure();

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const doneTimer = window.setTimeout(onComplete, 4050);
    return () => window.clearTimeout(doneTimer);
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-30"
    >
      {/* Full-Screen White Frame sliding fluidly Right -> Left after 1.9s hold */}
      {metrics && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: metrics.slideEndX }}
          transition={{
            delay: HOLD_DELAY,
            duration: 2.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed top-0 bottom-0 left-0 w-screen bg-white border-r border-black/15 will-change-transform"
        />
      )}

      {/* Flying Display Wordmark centered 100% during hold, gliding slowly to Hero h1 */}
      {metrics && (
        <motion.div
          initial={{ x: metrics.startX, y: metrics.startY }}
          animate={{ x: 0, y: 0 }}
          transition={{
            delay: HOLD_DELAY,
            duration: 2.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: 'fixed',
            top: metrics.top,
            left: metrics.left,
            zIndex: 50,
          }}
          className="w-fit will-change-transform"
        >
          <div className="relative w-fit">
            {/* Solid Black Initial Typography */}
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                delay: HOLD_DELAY + 0.05,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block w-fit font-medium uppercase tracking-[-0.04em] leading-[0.88] text-[clamp(1.7rem,6.9vw,6.75rem)] whitespace-nowrap text-black"
            >
              VOLKER SCHNÜTTGEN
            </motion.span>

            {/* Target Hollow White Typography */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: HOLD_DELAY + 0.15,
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 block w-fit font-medium uppercase tracking-[-0.04em] leading-[0.88] text-[clamp(1.7rem,6.9vw,6.75rem)] whitespace-nowrap text-transparent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.88)] [filter:drop-shadow(0_2px_12px_rgba(0,0,0,0.35))]"
            >
              VOLKER SCHNÜTTGEN
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
