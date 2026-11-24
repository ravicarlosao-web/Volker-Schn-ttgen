import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { type JournalEntry } from '../data/formtectureData';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedJournalEntry, UI_TRANSLATIONS } from '../i18n/translations';

interface ModalShellProps {
  title: string;
  eyebrow: string;
  rightMeta?: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalShell({
  title,
  eyebrow,
  rightMeta,
  closeLabel,
  onClose,
  children,
}: ModalShellProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1040px] max-h-[90vh] overflow-y-auto bg-white text-black border border-black/25 p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-black/20">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black truncate">
              {eyebrow}
            </span>
            {rightMeta && (
              <>
                <span className="text-black/25" aria-hidden="true">
                  /
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#666666] tabular-nums whitespace-nowrap">
                  {rightMeta}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex items-center gap-2 border border-black/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <span>{closeLabel}</span>
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
}

interface JournalArchiveModalProps {
  onClose: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

const JOURNAL_CATEGORIES: Array<'ALL' | JournalEntry['category']> = [
  'ALL',
  'EXHIBITION',
  'PUBLICATION',
];

export function JournalArchiveModal({
  onClose,
  onSelectEntry,
}: JournalArchiveModalProps) {
  const { language } = useLanguage();
  const { journalEntries } = usePortfolioData();
  const t = UI_TRANSLATIONS[language].modals;
  const tJournal = UI_TRANSLATIONS[language].journal;

  const [category, setCategory] = useState<'ALL' | JournalEntry['category']>('ALL');
  const filtered =
    category === 'ALL'
      ? journalEntries
      : journalEntries.filter((e) => e.category === category);

  const filterLabel = (cat: 'ALL' | JournalEntry['category']) => {
    if (cat === 'ALL') return t.filterAll;
    if (cat === 'EXHIBITION') return t.filterExhibition;
    return t.filterPublication;
  };

  return (
    <ModalShell
      title={t.archiveTitle}
      eyebrow={t.archiveEyebrow}
      rightMeta={t.recordsCount(filtered.length)}
      closeLabel={t.close}
      onClose={onClose}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/20">
        <div>
          <h3 className="text-[32px] sm:text-[40px] leading-tight font-normal tracking-[-0.02em]">
            {t.archiveTitle}
          </h3>
          <p className="mt-2 text-[14px] text-[#666666]">{t.archiveSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {JOURNAL_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'border-black/20 text-[#595959] hover:text-black hover:border-black/45'
                }`}
              >
                {filterLabel(cat)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divide-y divide-black/15">
        {filtered.map((entry) => {
          const loc = getLocalizedJournalEntry(entry, language);
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelectEntry(entry)}
              className="w-full py-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-baseline text-left group cursor-pointer"
            >
              <span className="md:col-span-2 font-mono text-[11px] tracking-[0.12em] text-[#262626] tabular-nums">
                {loc.date}
              </span>
              <span className="md:col-span-2 font-mono text-[11px] tracking-[0.12em] text-[#666666]">
                {tJournal.categories[entry.category]}
              </span>
              <div className="md:col-span-7">
                <span className="block text-[20px] sm:text-[22px] font-normal tracking-tight text-black group-hover:opacity-75">
                  {loc.title}
                </span>
                <span className="mt-1.5 block text-[13px] text-[#666666]">
                  {loc.subtitle}
                </span>
              </div>
              <span className="md:col-span-1 flex md:justify-end">
                <ArrowUpRight
                  className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  strokeWidth={1.25}
                />
              </span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}

interface StartProjectModalProps {
  onClose: () => void;
}

export function StartProjectModal({ onClose }: StartProjectModalProps) {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].modals;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryIndex, setEnquiryIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedSubject = t.subjectOptions[enquiryIndex] ?? t.subjectOptions[0];

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
          subject: selectedSubject,
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

  return (
    <ModalShell
      title={t.enquiryDialogTitle}
      eyebrow={t.enquiryEyebrow}
      rightMeta="SINTRA / ZET GALLERY"
      closeLabel={t.close}
      onClose={onClose}
    >
      {submitted ? (
        <div className="py-12 max-w-[540px]">
          <div className="w-10 h-10 border border-black/30 flex items-center justify-center mb-6">
            <Check className="w-5 h-5 text-black" strokeWidth={1.5} />
          </div>
          <h3 className="text-[32px] font-normal tracking-[-0.02em]">
            {t.enquiryPreparedTitle}
          </h3>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#333333]">
            {t.enquiryPreparedBody(name, selectedSubject)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 border border-black/35 px-6 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-[720px] space-y-6">
          <div>
            <h3 className="text-[32px] font-normal tracking-[-0.02em]">
              {t.enquiryTitle}
            </h3>
            <p className="mt-2 text-[14px] text-[#666666]">{t.enquiryMeta}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label
                htmlFor="enquiry-name"
                className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-2"
              >
                {t.nameLabel}
              </label>
              <input
                id="enquiry-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full bg-white border border-black/25 px-4 py-3 text-[14px] text-black placeholder:text-black/35 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="enquiry-email"
                className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-2"
              >
                {t.emailLabel}
              </label>
              <input
                id="enquiry-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full bg-white border border-black/25 px-4 py-3 text-[14px] text-black placeholder:text-black/35 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="enquiry-type"
              className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-2"
            >
              {t.subjectLabel}
            </label>
            <select
              id="enquiry-type"
              value={enquiryIndex}
              onChange={(e) => setEnquiryIndex(Number(e.target.value))}
              className="w-full bg-white border border-black/25 px-4 py-3 text-[14px] text-black focus:outline-none focus:border-black"
            >
              {t.subjectOptions.map((option, idx) => (
                <option key={option} value={idx}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="enquiry-message"
              className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-2"
            >
              {t.messageLabel}
            </label>
            <textarea
              id="enquiry-message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full bg-white border border-black/25 px-4 py-3 text-[14px] text-black placeholder:text-black/35 focus:outline-none focus:border-black"
            />
          </div>

          {submitError && (
            <p className="font-mono text-[11px] tracking-[0.06em] text-red-700 border border-red-300 bg-red-50 px-4 py-3">
              {submitError}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#666666]">
              {t.studioNote}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-[#262626] transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{t.sendBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export function PrivacyModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const t = UI_TRANSLATIONS[language].modals;

  return (
    <ModalShell
      title={t.privacyTitle}
      eyebrow={t.privacyEyebrow}
      rightMeta="SINTRA, PORTUGAL"
      closeLabel={t.close}
      onClose={onClose}
    >
      <div className="max-w-[680px] space-y-5 text-[15px] leading-[1.65] text-[#333333]">
        <h3 className="text-[32px] font-normal tracking-[-0.02em] text-black">
          {t.privacyTitle}
        </h3>
        <p>{t.privacyBody1}</p>
        <p>{t.privacyBody2}</p>
        <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#666666] pt-2">
          {t.privacyMeta}
        </p>
      </div>
    </ModalShell>
  );
}
