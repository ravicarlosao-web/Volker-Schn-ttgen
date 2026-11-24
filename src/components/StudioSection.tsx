import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { STUDIO_STATS } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedStudioStats, UI_TRANSLATIONS } from '../i18n/translations';
import { CountUpStat, RevealBlock, RevealLine } from './RevealText';

const YOUTUBE_VIDEO_ID = 'aLr3nrqZ9jE';
const YOUTUBE_START_SECONDS = 1667;

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: {
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('No window'));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<YTNamespace>((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      if (window.YT) {
        resolve(window.YT);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    } else if (window.YT?.Player) {
      resolve(window.YT);
    }
  });

  return ytApiPromise;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function hasBrowserUserActivation(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    userActivation?: { hasBeenActive?: boolean; isActive?: boolean };
  };
  return Boolean(
    nav.userActivation?.hasBeenActive || nav.userActivation?.isActive,
  );
}

function sendYouTubeCommand(
  iframe: HTMLIFrameElement | null,
  func: string,
  args: unknown[] = [],
): void {
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      'https://www.youtube.com',
    );
  } catch {
    // Ignore cross-origin postMessage errors
  }
}

export function StudioSection() {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].studio;
  const localizedStats = getLocalizedStudioStats(STUDIO_STATS, language);

  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const hasStartedPlaybackRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const hasUserGestureRef = useRef(hasBrowserUserActivation());
  const userMutedRef = useRef(false);
  const manualClosedRef = useRef(false);
  const lastVolumeRef = useRef(-1);
  const autoplayFallbackTimerRef = useRef<number | null>(null);

  const [manualClosed, setManualClosed] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const [browserBlockedAudio, setBrowserBlockedAudio] = useState(false);
  const [openPercent, setOpenPercent] = useState(100);

  const embedSrc = useMemo(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      enablejsapi: '1',
      start: String(YOUTUBE_START_SECONDS),
      autoplay: '0',
      mute: '0',
      controls: '1',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
    });
    if (origin) {
      params.set('origin', origin);
    }
    return `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?${params.toString()}`;
  }, []);

  // Full scroll arc across the stage:
  // 0.00 -> 0.28: shutters open (50% -> 16%) as section enters view
  // 0.28 -> 0.72: shutters stay open (16%) while user pauses to watch
  // 0.72 -> 0.98: shutters close (16% -> 50%) as user scrolls past overhead
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.95', 'end 0.05'],
  });

  const scrollOpenness = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 0.98],
    [0, 1, 1, 0],
  );
  const opennessMV = useMotionValue(0);
  const sideBarWidth = useTransform(opennessMV, [0, 1], ['50%', '16%']);

  const applyVideoForOpenness = useCallback(
    (rawOpenness: number) => {
      const clamped = clamp01(rawOpenness);
      const effectiveOpen = manualClosedRef.current ? 0 : clamped;
      const targetVolume = Math.round(effectiveOpen * 100);
      const displayPct = effectiveOpen < 0.06 ? 100 : Math.max(1, targetVolume);
      setOpenPercent((prev) => (prev === displayPct ? prev : displayPct));

      const player = playerRef.current;
      const iframe = iframeRef.current;

      const execMute = (muteState: boolean) => {
        if (player && playerReadyRef.current) {
          if (muteState) player.mute();
          else player.unMute();
        } else {
          sendYouTubeCommand(iframe, muteState ? 'mute' : 'unMute');
        }
      };

      const execVolume = (vol: number) => {
        if (player && playerReadyRef.current) {
          player.setVolume(vol);
        } else {
          sendYouTubeCommand(iframe, 'setVolume', [vol]);
        }
      };

      const execPlay = () => {
        if (player && playerReadyRef.current) {
          player.playVideo();
        } else {
          sendYouTubeCommand(iframe, 'playVideo');
        }
      };

      const execPause = () => {
        if (player && playerReadyRef.current) {
          player.pauseVideo();
        } else {
          sendYouTubeCommand(iframe, 'pauseVideo');
        }
      };

      const execSeek = (sec: number) => {
        if (player && playerReadyRef.current) {
          player.seekTo(sec, true);
        } else {
          sendYouTubeCommand(iframe, 'seekTo', [sec, true]);
        }
      };

      try {
        if (effectiveOpen < 0.06) {
          if (autoplayFallbackTimerRef.current !== null) {
            window.clearTimeout(autoplayFallbackTimerRef.current);
            autoplayFallbackTimerRef.current = null;
          }
          if (lastVolumeRef.current !== 0) {
            lastVolumeRef.current = 0;
            execVolume(0);
          }
          if (shouldPlayRef.current) {
            shouldPlayRef.current = false;
            execPause();
          }
          return;
        }

        const gestureActive =
          hasUserGestureRef.current || hasBrowserUserActivation();
        if (gestureActive) {
          hasUserGestureRef.current = true;
        }

        if (effectiveOpen >= 0.08 && !shouldPlayRef.current) {
          shouldPlayRef.current = true;
          if (!hasStartedPlaybackRef.current) {
            hasStartedPlaybackRef.current = true;
            execSeek(YOUTUBE_START_SECONDS);
          }

          execMute(userMutedRef.current);
          execVolume(targetVolume);
          lastVolumeRef.current = targetVolume;
          execPlay();

          if (!userMutedRef.current && !gestureActive) {
            if (autoplayFallbackTimerRef.current !== null) {
              window.clearTimeout(autoplayFallbackTimerRef.current);
            }
            autoplayFallbackTimerRef.current = window.setTimeout(() => {
              autoplayFallbackTimerRef.current = null;
              const p = playerRef.current;
              if (!p || !playerReadyRef.current || !shouldPlayRef.current || userMutedRef.current) {
                return;
              }
              if (hasUserGestureRef.current || hasBrowserUserActivation()) {
                hasUserGestureRef.current = true;
                try {
                  p.unMute();
                  p.setVolume(Math.round(clamp01(opennessMV.get()) * 100));
                  p.playVideo();
                } catch {
                  // Ignore
                }
                return;
              }
              try {
                const state = p.getPlayerState();
                if (state === -1 || state === 2 || state === 5) {
                  p.mute();
                  p.playVideo();
                  setBrowserBlockedAudio(true);
                } else if (p.isMuted()) {
                  setBrowserBlockedAudio(true);
                }
              } catch {
                // Ignore
              }
            }, 1200);
          }
          return;
        }

        if (shouldPlayRef.current) {
          if (
            !userMutedRef.current &&
            gestureActive &&
            player &&
            playerReadyRef.current &&
            player.isMuted()
          ) {
            player.unMute();
            setBrowserBlockedAudio(false);
          }
          if (targetVolume !== lastVolumeRef.current) {
            lastVolumeRef.current = targetVolume;
            execVolume(targetVolume);
          }
        }
      } catch {
        // Ignore transient YT IFrame state errors during teardown
      }
    },
    [opennessMV],
  );

  // Sync initial scroll position on mount in case visitor refreshes inside #studio
  useEffect(() => {
    const initial = scrollOpenness.get();
    if (!manualClosedRef.current && initial > 0) {
      opennessMV.set(initial);
    }
  }, [opennessMV, scrollOpenness]);

  // Track genuine user gesture to restore unmuted audio automatically if browser blocked initial autoplay
  useEffect(() => {
    const unlockAudio = () => {
      hasUserGestureRef.current = true;
      setBrowserBlockedAudio(false);
      const player = playerRef.current;
      if (shouldPlayRef.current && !userMutedRef.current) {
        try {
          const vol = Math.round(clamp01(opennessMV.get()) * 100);
          if (player && playerReadyRef.current) {
            player.unMute();
            player.setVolume(vol);
          } else {
            sendYouTubeCommand(iframeRef.current, 'unMute');
            sendYouTubeCommand(iframeRef.current, 'setVolume', [vol]);
          }
          lastVolumeRef.current = vol;
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [opennessMV]);

  // Bind YouTube IFrame Player API directly to the mounted <iframe>
  useEffect(() => {
    let cancelled = false;

    void loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return;

      new YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            if (cancelled) return;
            playerRef.current = event.target;
            playerReadyRef.current = true;
            try {
              event.target.unMute();
              event.target.setVolume(100);
              lastVolumeRef.current = 100;
            } catch {
              // Ignore
            }
            applyVideoForOpenness(opennessMV.get());
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              if (!shouldPlayRef.current || manualClosedRef.current) {
                try {
                  event.target.pauseVideo();
                } catch {
                  // Ignore
                }
                return;
              }
              if (
                !userMutedRef.current &&
                (hasUserGestureRef.current || hasBrowserUserActivation())
              ) {
                hasUserGestureRef.current = true;
                try {
                  if (event.target.isMuted()) {
                    event.target.unMute();
                  }
                  const vol = Math.round(clamp01(opennessMV.get()) * 100);
                  event.target.setVolume(vol);
                  lastVolumeRef.current = vol;
                  setBrowserBlockedAudio(false);
                } catch {
                  // Ignore
                }
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerReadyRef.current = false;
      shouldPlayRef.current = false;
      if (autoplayFallbackTimerRef.current !== null) {
        window.clearTimeout(autoplayFallbackTimerRef.current);
        autoplayFallbackTimerRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
        playerRef.current = null;
      }
    };
  }, [applyVideoForOpenness, opennessMV]);

  // Pause automatically if browser tab is hidden, resume when visible if stage is open
  useEffect(() => {
    const onVisibilityChange = () => {
      const player = playerRef.current;
      try {
        if (document.hidden) {
          if (player && playerReadyRef.current) player.pauseVideo();
          else sendYouTubeCommand(iframeRef.current, 'pauseVideo');
        } else if (shouldPlayRef.current && !manualClosedRef.current) {
          if (player && playerReadyRef.current) player.playVideo();
          else sendYouTubeCommand(iframeRef.current, 'playVideo');
        }
      } catch {
        // Ignore
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useMotionValueEvent(scrollOpenness, 'change', (latest) => {
    if (!manualClosedRef.current) {
      opennessMV.set(latest);
    }
  });

  useMotionValueEvent(opennessMV, 'change', (latest) => {
    applyVideoForOpenness(latest);
  });

  const toggleManualClosed = useCallback(() => {
    hasUserGestureRef.current = true;
    setBrowserBlockedAudio(false);
    setManualClosed((prev) => {
      const next = !prev;
      manualClosedRef.current = next;
      const target = next ? 0 : scrollOpenness.get();
      animate(opennessMV, target, {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      });
      return next;
    });
  }, [opennessMV, scrollOpenness]);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hasUserGestureRef.current = true;

      const nextMuted = browserBlockedAudio ? false : !userMutedRef.current;
      setBrowserBlockedAudio(false);
      userMutedRef.current = nextMuted;
      setUserMuted(nextMuted);

      const player = playerRef.current;
      try {
        if (nextMuted) {
          if (player && playerReadyRef.current) player.mute();
          else sendYouTubeCommand(iframeRef.current, 'mute');
        } else {
          const effectiveOpen = manualClosedRef.current
            ? 0
            : clamp01(opennessMV.get());
          const vol =
            effectiveOpen < 0.06
              ? 100
              : Math.max(1, Math.round(effectiveOpen * 100));
          if (player && playerReadyRef.current) {
            player.unMute();
            player.setVolume(vol);
          } else {
            sendYouTubeCommand(iframeRef.current, 'unMute');
            sendYouTubeCommand(iframeRef.current, 'setVolume', [vol]);
          }
          lastVolumeRef.current = vol;
        }
      } catch {
        // Ignore
      }
    },
    [browserBlockedAudio, opennessMV],
  );

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

        {/* Shutter Reveal Stage (Scroll Open -> Hold -> Scroll Close + Gradual Audio) */}
        <div className="mt-12 lg:mt-14">
          <div
            ref={stageRef}
            className="relative w-full aspect-[16/8.2] min-h-[300px] sm:min-h-[430px] bg-black border border-white/20 overflow-hidden select-none"
          >
            {/* Direct Embedded YouTube Player (starts at 1667s, volume tracks shutter aperture) */}
            <div className="absolute inset-0 z-[1] px-[16%] bg-black">
              <iframe
                ref={iframeRef}
                id="vs-studio-youtube-player"
                src={embedSrc}
                title="Volker Schnüttgen — Studio & Sculpture Documentary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full border-0 block"
              />
            </div>

            {/* Left Shutter Panel */}
            <motion.button
              type="button"
              onClick={toggleManualClosed}
              aria-label={manualClosed ? t.openShuttersAria : t.closeShuttersAria}
              style={{ width: sideBarWidth }}
              className="absolute left-0 top-0 bottom-0 z-10 bg-black border-r border-white/60 flex items-end justify-end p-4 sm:p-5 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white whitespace-nowrap">
                {t.groundFloor}
              </span>
            </motion.button>

            {/* Right Shutter Panel */}
            <motion.button
              type="button"
              onClick={toggleManualClosed}
              aria-label={manualClosed ? t.openShuttersAria : t.closeShuttersAria}
              style={{ width: sideBarWidth }}
              className="absolute right-0 top-0 bottom-0 z-10 bg-black border-l border-white/60 flex items-end justify-start p-4 sm:p-5 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-white tabular-nums whitespace-nowrap">
                ±0.00
              </span>
            </motion.button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#A3A3A3]">
              {t.caption}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center gap-2 border border-white/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-white hover:border-white transition-colors cursor-pointer tabular-nums"
              >
                {userMuted || browserBlockedAudio ? (
                  <VolumeX className="w-3.5 h-3.5" strokeWidth={1.5} />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
                <span>
                  {userMuted
                    ? 'AUDIO OFF'
                    : browserBlockedAudio
                      ? `ACTIVATE AUDIO (${openPercent}%)`
                      : `AUDIO ${openPercent}%`}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleManualClosed}
                className="border border-white/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#A3A3A3] hover:text-white hover:border-white transition-colors cursor-pointer"
              >
                {manualClosed ? t.openShuttersAria : t.closeShuttersAria}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
