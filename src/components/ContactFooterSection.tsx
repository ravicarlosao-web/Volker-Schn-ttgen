import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { ELEVATOR_FLOORS, type FloorItem } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { RevealBlock, RevealLine } from './RevealText';

interface ContactFooterSectionProps {
  onSelectFloor: (floorId: FloorItem['id']) => void;
  onOpenStartProject?: () => void;
  onOpenPrivacy: () => void;
}

export function ContactFooterSection({
  onSelectFloor,
  onOpenPrivacy,
}: ContactFooterSectionProps) {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].contact;
  const tFloors = UI_TRANSLATIONS[language].sidebar.floors;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [location, setLocation] = useState('');
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [scopeIndex, setScopeIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedSubject =
    t.form.subjectOptions[subjectIndex] ?? t.form.subjectOptions[0];
  const selectedScope =
    t.form.scopeOptions[scopeIndex] ?? t.form.scopeOptions[0];

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('mail@volker-schnuettgen.com').catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organisation: organisation.trim(),
          location: location.trim(),
          subject: selectedSubject,
          scope: selectedScope,
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setSubmitError(body.error || 'Unable to send enquiry.');
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    setSubmitError('');
  };

  return (
    <footer
      id="contact"
      data-floor="contact"
      className="bg-white text-black pt-20 lg:pt-28 pb-10 px-5 sm:px-8 lg:px-12 border-t border-black/15"
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
              -7.20
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
            <p className="text-[14px] leading-[1.45] text-[#595959] max-w-[300px]">
              {t.subtitle}
            </p>
          </RevealLine>
        </div>

        {/* 2-Column Architectural Contact Grid (Form Left + Stacked Directory Right) */}
        <div className="mt-12 pb-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Bottom-Bordered Architectural Form */}
          <div className="lg:col-span-7">
            <RevealBlock>
              {submitted ? (
                <div className="border-t border-black/20 pt-8 pb-6 max-w-[540px]">
                  <div className="w-10 h-10 border border-black/30 flex items-center justify-center mb-6">
                    <Check className="w-5 h-5 text-black" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[28px] sm:text-[32px] font-normal tracking-[-0.02em] text-black">
                    {t.form.confirmedTitle}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.6] text-[#333333]">
                    {t.form.confirmedBody(name, selectedSubject)}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-3 border border-black/35 px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <span>{t.form.newEnquiryBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div>
                      <label
                        htmlFor="footer-name"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.nameLabel}
                      </label>
                      <input
                        id="footer-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.form.namePlaceholder}
                        className="w-full bg-transparent border-b border-black/25 focus:border-black py-3 text-[16px] text-black placeholder:text-black/35 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="footer-email"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.emailLabel}
                      </label>
                      <input
                        id="footer-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.form.emailPlaceholder}
                        className="w-full bg-transparent border-b border-black/25 focus:border-black py-3 text-[16px] text-black placeholder:text-black/35 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Organisation & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div>
                      <label
                        htmlFor="footer-org"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.orgLabel}
                      </label>
                      <input
                        id="footer-org"
                        type="text"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder={t.form.orgPlaceholder}
                        className="w-full bg-transparent border-b border-black/25 focus:border-black py-3 text-[16px] text-black placeholder:text-black/35 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="footer-location"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.locationLabel}
                      </label>
                      <input
                        id="footer-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t.form.locationPlaceholder}
                        className="w-full bg-transparent border-b border-black/25 focus:border-black py-3 text-[16px] text-black placeholder:text-black/35 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Subject & Context */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div>
                      <label
                        htmlFor="footer-subject"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.subjectLabel}
                      </label>
                      <div className="relative">
                        <select
                          id="footer-subject"
                          value={subjectIndex}
                          onChange={(e) => setSubjectIndex(Number(e.target.value))}
                          className="w-full appearance-none bg-transparent border-b border-black/25 focus:border-black py-3 pr-7 text-[16px] text-black focus:outline-none transition-colors cursor-pointer"
                        >
                          {t.form.subjectOptions.map((option, idx) => (
                            <option key={option} value={idx}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="w-4 h-4 text-[#666666] pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="footer-scope"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                      >
                        {t.form.scopeLabel}
                      </label>
                      <div className="relative">
                        <select
                          id="footer-scope"
                          value={scopeIndex}
                          onChange={(e) => setScopeIndex(Number(e.target.value))}
                          className="w-full appearance-none bg-transparent border-b border-black/25 focus:border-black py-3 pr-7 text-[16px] text-black focus:outline-none transition-colors cursor-pointer"
                        >
                          {t.form.scopeOptions.map((option, idx) => (
                            <option key={option} value={idx}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="w-4 h-4 text-[#666666] pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label
                      htmlFor="footer-message"
                      className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                    >
                      {t.form.messageLabel}
                    </label>
                    <textarea
                      id="footer-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.form.messagePlaceholder}
                      className="w-full bg-transparent border-b border-black/25 focus:border-black py-3 text-[16px] text-black placeholder:text-black/35 focus:outline-none resize-y transition-colors"
                    />
                  </div>

                  {submitError && (
                    <p className="font-mono text-[11px] tracking-[0.06em] text-red-700 border border-red-300 bg-red-50 px-4 py-3">
                      {submitError}
                    </p>
                  )}

                  {/* Sharp Architectural Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="min-w-[230px] inline-flex items-center justify-between gap-6 border border-black/35 px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-black disabled:opacity-50"
                    >
                      <span>{t.form.submitBtn}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              )}
            </RevealBlock>
          </div>

          {/* Right Column: Stacked Top-Bordered Direct Contact / Representation / Studio */}
          <div className="lg:col-start-9 lg:col-span-4 space-y-10">
            {/* Block 1: Direct Contact */}
            <div className="border-t border-black/20 pt-5">
              <RevealLine>
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  {t.directContact}
                </span>
              </RevealLine>

              <div className="mt-4 flex flex-col items-start gap-3.5">
                <RevealLine delay={0.04}>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/30 font-mono text-[12px] tracking-[0.06em] uppercase text-black hover:border-black transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
                  >
                    <span>mail@volker-schnuettgen.com</span>
                    {copiedEmail ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-black">
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {t.copiedLabel}
                      </span>
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#666666] shrink-0" strokeWidth={1.25} />
                    )}
                  </button>
                </RevealLine>

                <RevealLine delay={0.08}>
                  <a
                    href="tel:+351962370193"
                    className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/30 font-mono text-[12px] tracking-[0.06em] uppercase text-black hover:border-black transition-colors tabular-nums"
                  >
                    <span>+351 962 370 193</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#666666] shrink-0" strokeWidth={1.25} />
                  </a>
                </RevealLine>
              </div>
            </div>

            {/* Block 2: Gallery Representation */}
            <div className="border-t border-black/20 pt-5">
              <RevealLine delay={0.06}>
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  {t.representationLabel}
                </span>
              </RevealLine>

              <RevealBlock delay={0.1} className="mt-4">
                <p className="inline-flex items-center gap-2.5 pb-1.5 border-b border-black/30 font-mono text-[12px] tracking-[0.06em] uppercase text-black">
                  <span>ZET GALLERY</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#666666] shrink-0" strokeWidth={1.25} />
                </p>
                <p className="mt-2.5 text-[14px] text-[#595959]">
                  {t.representationRole}
                </p>
              </RevealBlock>
            </div>

            {/* Block 3: Studio */}
            <div className="border-t border-black/20 pt-5">
              <RevealLine delay={0.08}>
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  {t.studioLabel}
                </span>
              </RevealLine>

              <RevealBlock delay={0.12}>
                <address className="mt-4 not-italic text-[16px] leading-[1.7] text-black">
                  [STUDIO]
                  <br />
                  Sintra, Portugal
                </address>
              </RevealBlock>
            </div>
          </div>
        </div>

        {/* 6-Column Footer Directory */}
        <div className="border-t border-black/20 pt-8 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8">
          {ELEVATOR_FLOORS.map((floor, idx) => (
            <div
              key={floor.id}
              className={`flex flex-col justify-between min-h-[104px] pr-4 ${
                idx > 0 ? 'lg:border-l lg:border-black/15 lg:pl-5' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[22px] font-normal tracking-tight text-black tabular-nums">
                  {floor.code}
                </span>
                <span className="font-mono text-[10px] tracking-[0.06em] text-[#666666] tabular-nums">
                  {floor.elevation}
                </span>
              </div>

              <div className="mt-6 flex flex-col items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectFloor(floor.id)}
                  className="inline-flex items-center gap-2 pb-1 border-b border-black/35 font-mono text-[10px] tracking-[0.14em] uppercase text-black hover:border-black transition-colors cursor-pointer"
                >
                  <span>{tFloors[floor.id]}</span>
                  <ArrowRight className="w-3 h-3" strokeWidth={1.25} aria-hidden="true" />
                </button>

                {floor.id === 'contact' && (
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="inline-flex items-center gap-2 pb-1 border-b border-black/20 font-mono text-[10px] tracking-[0.14em] uppercase text-[#595959] hover:text-black hover:border-black transition-colors cursor-pointer"
                  >
                    <span>{t.privacy}</span>
                    <ArrowRight className="w-3 h-3" strokeWidth={1.25} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Privacy Bar */}
        <div className="mt-8 pt-6 border-t border-black/15 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666]">
            {t.copyright}
          </span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] hover:text-black transition-colors cursor-pointer"
            >
              <span>{t.privacy}</span>
              <ArrowUpRight className="w-3 h-3" strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
