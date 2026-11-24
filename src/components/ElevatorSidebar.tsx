import { motion } from 'motion/react';
import { ELEVATOR_FLOORS, type FloorItem } from '../data/formtectureData';
import { type Language, useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/translations';

interface ElevatorSidebarProps {
  activeFloor: FloorItem['id'];
  onSelectFloor: (floorId: FloorItem['id']) => void;
  delayReveal?: boolean;
}

const LANGUAGES: Array<{ code: Language; label: string; aria: string }> = [
  { code: 'en', label: 'EN', aria: 'Switch language to English' },
  { code: 'pt', label: 'PT', aria: 'Mudar idioma para Português' },
  { code: 'fr', label: 'FR', aria: 'Passer la langue en français' },
];

export function ElevatorSidebar({
  activeFloor,
  onSelectFloor,
  delayReveal = false,
}: ElevatorSidebarProps) {
  const { language, setLanguage } = useLanguage();
  const t = UI_TRANSLATIONS[language].sidebar;
  const currentFloor =
    ELEVATOR_FLOORS.find((f) => f.id === activeFloor) ?? ELEVATOR_FLOORS[0];

  return (
    <>
      {/* Desktop Fixed Left Elevator Rail */}
      <motion.aside
        initial={delayReveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={
          delayReveal
            ? { delay: 2.9, duration: 0.95, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0 }
        }
        aria-label={t.ariaNav}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[88px] lg:w-[96px] bg-white border-r border-black/15 flex-col justify-between px-3 py-7 select-none"
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onSelectFloor('index')}
            className="text-[20px] font-semibold tracking-tight text-black hover:opacity-65 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
            aria-label={t.ariaHome}
          >
            VS.
          </button>
        </div>

        <nav className="flex flex-col border-b border-black/15">
          {ELEVATOR_FLOORS.map((floor) => {
            const isActive = floor.id === activeFloor;
            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => onSelectFloor(floor.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`group w-full border-t border-black/15 py-2.5 px-1 flex flex-col items-center justify-center text-center transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-transparent text-black hover:bg-black/[0.04]'
                }`}
              >
                <span className="text-[20px] lg:text-[22px] leading-none font-normal tracking-tight tabular-nums">
                  {floor.code}
                </span>
                <span
                  className={`mt-1.5 font-mono text-[8.5px] lg:text-[9px] leading-none tracking-[0.09em] uppercase whitespace-nowrap ${
                    isActive
                      ? 'text-[#B3B3B3]'
                      : 'text-[#666666] group-hover:text-black'
                  }`}
                >
                  {t.floors[floor.id]}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-4 text-center">
          {/* Sharp Architectural Language Selector (EN / PT / DE) */}
          <div
            role="group"
            aria-label="Language"
            className="grid grid-cols-3 w-full border border-black/15 divide-x divide-black/15"
          >
            {LANGUAGES.map((item) => {
              const active = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  aria-label={item.aria}
                  aria-pressed={active}
                  className={`py-1.5 font-mono text-[9px] tracking-[0.06em] uppercase transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                    active
                      ? 'bg-black text-white font-medium'
                      : 'bg-white text-[#666666] hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#666666]">
              {t.elevation}
            </span>
            <span className="mt-1 font-mono text-[11px] tracking-[0.06em] text-black tabular-nums">
              {currentFloor.elevation}
            </span>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Compact Sticky Floor Bar */}
      <motion.header
        initial={delayReveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={
          delayReveal
            ? { delay: 2.9, duration: 0.95, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0 }
        }
        className="md:hidden fixed top-0 left-0 right-0 z-40 h-[50px] bg-white/95 backdrop-blur-sm border-b border-black/15 px-3 sm:px-4 flex items-center justify-between gap-2"
      >
        <button
          type="button"
          onClick={() => onSelectFloor('index')}
          className="text-[17px] font-semibold tracking-tight text-black whitespace-nowrap shrink-0 cursor-pointer"
          aria-label={t.ariaHome}
        >
          VS.
        </button>

        <nav
          aria-label={t.ariaNav}
          className="flex items-center gap-0.5 overflow-x-auto no-scrollbar"
        >
          {ELEVATOR_FLOORS.map((floor) => {
            const isActive = floor.id === activeFloor;
            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => onSelectFloor(floor.id)}
                className={`px-1.5 py-1 font-mono text-[11px] tracking-[0.06em] tabular-nums whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-white font-medium'
                    : 'text-[#666666] hover:text-black'
                }`}
              >
                {floor.code}
              </button>
            );
          })}
        </nav>

        <div
          role="group"
          aria-label="Language"
          className="flex items-center border border-black/20 divide-x divide-black/20 shrink-0"
        >
          {LANGUAGES.map((item) => {
            const active = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                aria-label={item.aria}
                aria-pressed={active}
                className={`px-1.5 py-0.5 font-mono text-[10px] tracking-[0.04em] uppercase transition-colors cursor-pointer ${
                  active
                    ? 'bg-black text-white font-medium'
                    : 'bg-white text-[#666666] hover:text-black'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </motion.header>
    </>
  );
}
