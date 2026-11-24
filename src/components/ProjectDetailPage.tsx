import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { type ProjectItem } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedProject } from '../i18n/projectTranslations';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ArchitecturalImage } from './ArchitecturalImage';
import { RevealBlock, RevealLine } from './RevealText';

interface ProjectDetailPageProps {
  project: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
  onOpenAllProjects: () => void;
}

export function ProjectDetailPage({
  project,
  onSelectProject,
  onOpenAllProjects,
}: ProjectDetailPageProps) {
  const { language } = useLanguage();
  const { projects } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].projectDetail;
  const localizedProject = getLocalizedProject(project, language);

  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const nextProject =
    projects.length > 0
      ? projects[(currentIdx >= 0 ? currentIdx + 1 : 0) % projects.length]
      : project;

  return (
    <article className="bg-white text-black pt-[74px] md:pt-8 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Floor / Typology Eyebrow Rule */}
        <div className="flex items-center gap-5 pb-8 lg:pb-10">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black tabular-nums whitespace-nowrap">
            {localizedProject.floor}
          </span>
          <div className="h-px flex-1 bg-black/20" />
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#666666] whitespace-nowrap">
            {t.typologyValues[localizedProject.typology]}
          </span>
        </div>

        {/* Monumental Work Title */}
        <RevealLine>
          <h1 className="font-normal text-black tracking-[-0.03em] leading-[0.98] text-[clamp(2.75rem,7.2vw,6.25rem)] text-balance">
            {localizedProject.title}
          </h1>
        </RevealLine>

        {/* Offset Lead Description on Right */}
        <div className="mt-8 lg:mt-10 pb-10 border-b-2 border-black grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-start-7 lg:col-span-6">
            <RevealBlock delay={0.08}>
              <p className="text-[20px] sm:text-[24px] lg:text-[26px] leading-[1.32] font-normal tracking-[-0.015em] text-black">
                {localizedProject.lead}
              </p>
            </RevealBlock>
          </div>
        </div>

        {/* Large Full-Width Hero Photograph */}
        <div className="mt-10 aspect-[16/10] w-full overflow-hidden bg-[#F2F2F2]">
          <ArchitecturalImage
            src={localizedProject.image}
            alt={`${localizedProject.title} (${localizedProject.year})`}
            fallbackTitle={localizedProject.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 5-Column Metadata Strip */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="border-t border-black/20 pt-3.5">
            <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
              {t.location}
            </span>
            <span className="mt-2.5 block font-mono text-[11px] tracking-[0.1em] uppercase text-black">
              {localizedProject.location}
            </span>
          </div>

          <div className="border-t border-black/20 pt-3.5">
            <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
              {t.year}
            </span>
            <span className="mt-2.5 block font-mono text-[11px] tracking-[0.1em] uppercase text-black tabular-nums">
              {localizedProject.year}
            </span>
          </div>

          <div className="border-t border-black/20 pt-3.5">
            <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
              {t.typology}
            </span>
            <span className="mt-2.5 block font-mono text-[11px] tracking-[0.1em] uppercase text-black">
              {t.typologyValues[localizedProject.typology]}
            </span>
          </div>

          <div className="border-t border-black/20 pt-3.5">
            <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
              {t.medium}
            </span>
            <span className="mt-2.5 block font-mono text-[11px] tracking-[0.1em] uppercase text-black">
              {localizedProject.medium}
            </span>
          </div>

          <div className="border-t border-black/20 pt-3.5 col-span-2 sm:col-span-1">
            <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
              {t.context}
            </span>
            <span className="mt-2.5 block font-mono text-[11px] tracking-[0.1em] uppercase text-black">
              {localizedProject.context}
            </span>
          </div>
        </div>

        {/* Section A–A / Approach */}
        <section className="mt-24 lg:mt-28">
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black whitespace-nowrap">
              {t.sectionLabel}
            </span>
            <div className="h-px flex-1 bg-black/20" />
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#666666] whitespace-nowrap">
              {t.approachLabel}
            </span>
          </div>

          <div className="mt-8 pb-7 border-b-2 border-black flex flex-col md:flex-row md:items-end justify-between gap-4">
            <RevealLine>
              <h2 className="text-[38px] sm:text-[50px] lg:text-[58px] leading-[1.04] font-normal tracking-[-0.025em] text-black">
                {t.approachHeading}
              </h2>
            </RevealLine>
            <RevealLine delay={0.08}>
              <p className="text-[14px] leading-[1.45] text-[#595959] max-w-[260px]">
                {t.approachSubtitle}
              </p>
            </RevealLine>
          </div>

          {/* 3 Horizontal Structured Rows */}
          <div className="divide-y divide-black/15 border-b border-black/15">
            {localizedProject.steps.map((step, idx) => (
              <div
                key={step.label}
                className="py-10 lg:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                <div className="md:col-span-5">
                  <RevealLine delay={idx * 0.04}>
                    <h3 className="text-[22px] sm:text-[26px] font-normal tracking-[-0.02em] text-black">
                      {step.label}
                    </h3>
                  </RevealLine>
                </div>
                <div className="md:col-span-7">
                  <RevealBlock delay={idx * 0.05 + 0.04}>
                    <p className="text-[20px] sm:text-[24px] lg:text-[27px] leading-[1.32] font-normal tracking-[-0.015em] text-black">
                      {step.text}
                    </p>
                  </RevealBlock>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Column Vertical Gallery Triptych */}
        <section className="mt-16 lg:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localizedProject.gallery.map((imgSrc, index) => (
              <div
                key={`${localizedProject.id}-gallery-${index}`}
                className="aspect-[3/4] w-full overflow-hidden bg-[#F2F2F2]"
              >
                <ArchitecturalImage
                  src={imgSrc}
                  alt={`${localizedProject.title} — ${index + 1}`}
                  fallbackTitle={`${localizedProject.title} (${index + 1})`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Project Switcher Bar */}
        <div className="mt-16 lg:mt-20 pt-8 pb-12 border-t border-black/20 flex flex-wrap items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => onSelectProject(nextProject)}
            className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/45 text-[22px] sm:text-[26px] font-normal tracking-[-0.02em] text-black hover:opacity-70 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.nextWork}</span>
            <ArrowDownRight className="w-5 h-5" strokeWidth={1.25} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenAllProjects}
            className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/45 text-[22px] sm:text-[26px] font-normal tracking-[-0.02em] text-black hover:opacity-70 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            <span>{t.allWorks}</span>
            <ArrowRight className="w-5 h-5" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
