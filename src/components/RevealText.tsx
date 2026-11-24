import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Architectural bottom-to-top masked text rise triggered on scroll.
 * Observes an untransformed outer container so transforms never block IntersectionObserver,
 * and releases overflow clipping once settled so descenders/diacritics are never clipped.
 */
export function RevealLine({
  children,
  delay = 0,
  className = '',
}: RevealTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, amount: 'some' });
  const [shown, setShown] = useState<boolean>(() => prefersReducedMotion());
  const [settled, setSettled] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (shown) return;
    if (inView) {
      setShown(true);
      return;
    }

    const check = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98) {
        setShown(true);
      }
    };

    check();
    const rafId = window.requestAnimationFrame(check);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [inView, shown]);

  return (
    <div
      ref={wrapperRef}
      className={`${settled ? '' : 'overflow-hidden py-2 -my-2'} ${className}`}
    >
      <motion.div
        initial={shown ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
        animate={shown ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{
          duration: 0.85,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        onAnimationComplete={() => {
          if (shown) setSettled(true);
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Smooth bottom-to-top rise for multi-line editorial copy blocks on scroll.
 * Observes an untransformed outer container with amount: 'some' and scroll fallback.
 */
export function RevealBlock({
  children,
  delay = 0,
  className = '',
}: RevealTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, amount: 'some' });
  const [shown, setShown] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (shown) return;
    if (inView) {
      setShown(true);
      return;
    }

    const check = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98) {
        setShown(true);
      }
    };

    check();
    const rafId = window.requestAnimationFrame(check);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [inView, shown]);

  return (
    <div ref={wrapperRef} className={className}>
      <motion.div
        initial={shown ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
        animate={shown ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface CountUpStatProps {
  value: string;
  delay?: number;
}

/**
 * Counts numeric milestones (e.g. 1961, 1993, 2010–16, 1986) smoothly on scroll into view.
 */
export function CountUpStat({ value, delay = 0 }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 'some' });
  const [triggered, setTriggered] = useState(false);
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    if (triggered) return;
    if (inView) {
      setTriggered(true);
      return;
    }

    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        setTriggered(true);
      }
    };

    check();
    const rafId = window.requestAnimationFrame(check);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [inView, triggered]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    if (!triggered) {
      return;
    }

    if (value.includes('–')) {
      const parts = value.split('–');
      const targetA = parseInt(parts[0], 10);
      const targetB = parseInt(parts[1], 10);
      if (Number.isNaN(targetA) || Number.isNaN(targetB)) {
        setDisplay(value);
        return;
      }

      const controls = animate(0, 1, {
        duration: 1.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (progress) => {
          const curA = Math.round(progress * targetA);
          const curB = Math.round(progress * targetB);
          setDisplay(`${curA}–${String(curB).padStart(2, '0')}`);
        },
        onComplete: () => setDisplay(value),
      });

      return () => controls.stop();
    }

    const target = parseInt(value, 10);
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, target, {
      duration: 1.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(String(Math.round(latest)));
      },
      onComplete: () => setDisplay(value),
    });

    return () => controls.stop();
  }, [triggered, value, delay]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {display}
    </span>
  );
}
