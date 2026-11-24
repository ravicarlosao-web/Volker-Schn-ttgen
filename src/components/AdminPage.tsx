import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CloudUpload,
  Database,
  ImagePlus,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import type {
  EnquiryItem,
  JournalEntry,
  PortfolioCategoryItem,
  ProjectItem,
} from '../data/formtectureData';

interface AdminPageProps {
  onExit: () => void;
}

type AdminTab =
  | 'hero'
  | 'categories'
  | 'works'
  | 'journal'
  | 'enquiries'
  | 'sync';

interface AuthStatusResponse {
  adminEnabled?: boolean;
  disabledReason?: string | null;
  needsSetup: boolean;
}

interface AdminSyncStats {
  totalImages: number;
  cloudinaryImages: number;
  remainingLocalAssets: number;
  syncedPercent: number;
  readyToMigrate: boolean;
  fullySynchronized: boolean;
}

interface AdminStorageCounts {
  siteImages: number;
  categories: number;
  projects: number;
  journal: number;
}

interface AdminStorageState {
  tursoCloud: boolean;
  persistenceEnabled: boolean;
  cloudinaryConfigured: boolean;
  sync: AdminSyncStats;
  counts: AdminStorageCounts;
}

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  onUploadFile: (file: File) => Promise<string | null>;
  cloudinaryConfigured: boolean;
  previewAspect?: string;
  allowClear?: boolean;
}

function ImageField({
  label,
  value,
  onChange,
  onUploadFile,
  cloudinaryConfigured,
  previewAspect = 'aspect-[16/10]',
  allowClear = false,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = async (file: File | undefined) => {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const url = await onUploadFile(file);
      if (url) onChange(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    await processFile(file);
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    await processFile(file);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#595959]">
          {label}
        </span>
        {value && allowClear && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => onChange('')}
            className="font-mono text-[10px] tracking-[0.12em] uppercase text-red-700 hover:underline cursor-pointer disabled:opacity-50"
          >
            REMOVE
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2.5">
          <div
            className={`w-full ${previewAspect} max-h-[240px] bg-black/5 border border-black/20 overflow-hidden`}
          >
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full inline-flex items-center justify-center gap-2 border border-black/30 px-3 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>
              {isUploading
                ? 'UPLOADING IMAGE...'
                : cloudinaryConfigured
                  ? 'REPLACE PHOTO (CLOUDINARY)'
                  : 'REPLACE PHOTO'}
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full min-h-[132px] border border-dashed border-black/35 hover:border-black bg-[#fafafa] hover:bg-black/[0.03] px-4 py-6 flex flex-col items-center justify-center text-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-5 h-5 text-black/70" strokeWidth={1.5} />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-black">
            {isUploading
              ? 'UPLOADING IMAGE...'
              : cloudinaryConfigured
                ? 'SELECT OR DROP IMAGE (CLOUDINARY)'
                : 'SELECT OR DROP IMAGE TO UPLOAD'}
          </span>
          <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-[#666666]">
            JPG, PNG, WEBP OR GIF · MAX 5MB
          </span>
        </button>
      )}
    </div>
  );
}

const EMPTY_CATEGORY: PortfolioCategoryItem = {
  id: '',
  code: '05',
  title: '',
  categoryLine: '',
  metaLine: '',
  image: '',
};

function createEmptyProject(defaultCategory: string): ProjectItem {
  return {
    id: '',
    floor: '18',
    title: '',
    location: 'SINTRA, PT',
    year: String(new Date().getFullYear()),
    typology: 'SCULPTURE',
    portfolioCategory: defaultCategory || 'STONE',
    categoryLine: 'SCULPTURE · TERRITORIAL MATERIALITY',
    medium: 'OAK WOOD · STONE',
    context: 'SINTRA STUDIO',
    lead: '',
    image: '',
    gallery: ['', '', ''],
    steps: [
      { label: 'Material', text: '' },
      { label: 'Form', text: '' },
      { label: 'Context', text: '' },
    ],
    featured: true,
  };
}

const EMPTY_JOURNAL: JournalEntry = {
  id: '',
  date: 'EXHIBITION · 2026',
  category: 'EXHIBITION',
  title: '',
  subtitle: '',
  image: '',
  creditLabel: 'CURATED BY',
  creditValue: 'ZET GALLERY',
  secondaryLabel: 'VENUE',
  secondaryValue: 'PORTUGAL',
  introParagraphs: [''],
  largeHeading: '',
  largeHeadingText: '',
  subHeading: 'Material & Space',
  subHeadingText: '',
  details: [''],
  featured: true,
};

export function AdminPage({ onExit }: AdminPageProps) {
  const {
    heroImage: liveHeroImage,
    practiceImage: livePracticeImage,
    modelImage: liveModelImage,
    categories,
    projects,
    journalEntries,
    refreshPortfolio,
  } = usePortfolioData();

  // Bearer token held strictly in React state (never localStorage/sessionStorage)
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
  const [adminStorage, setAdminStorage] = useState<AdminStorageState>({
    tursoCloud: false,
    persistenceEnabled: true,
    cloudinaryConfigured: false,
    sync: {
      totalImages: 0,
      cloudinaryImages: 0,
      remainingLocalAssets: 0,
      syncedPercent: 0,
      readyToMigrate: false,
      fullySynchronized: false,
    },
    counts: {
      siteImages: 3,
      categories: 0,
      projects: 0,
      journal: 0,
    },
  });
  const [migrating, setMigrating] = useState(false);
  const [lastMigrationSummary, setLastMigrationSummary] = useState<string | null>(
    null,
  );
  const [authLoading, setAuthLoading] = useState(true);

  // Login / First-run setup form
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Navigation & feedback
  const [activeTab, setActiveTab] = useState<AdminTab>('enquiries');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: 'category' | 'work' | 'journal' | 'enquiry';
    id: string;
  } | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  // Editor refs for scroll-into-view when selecting Edit
  const categoryFormRef = useRef<HTMLFormElement | null>(null);
  const workFormRef = useRef<HTMLFormElement | null>(null);
  const journalFormRef = useRef<HTMLFormElement | null>(null);

  // Hero & Site images state
  const [heroDraft, setHeroDraft] = useState(liveHeroImage);
  const [practiceDraft, setPracticeDraft] = useState(livePracticeImage);
  const [modelDraft, setModelDraft] = useState(liveModelImage);
  const [heroSaving, setHeroSaving] = useState(false);

  // Category state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<PortfolioCategoryItem>(EMPTY_CATEGORY);
  const [categorySaving, setCategorySaving] = useState(false);

  // Works state
  const [worksSearch, setWorksSearch] = useState('');
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workDraft, setWorkDraft] = useState<ProjectItem>(() =>
    createEmptyProject(categories[0]?.id ?? 'STONE'),
  );
  const [workSaving, setWorkSaving] = useState(false);

  // Journal state
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [journalDraft, setJournalDraft] = useState<JournalEntry>(EMPTY_JOURNAL);
  const [introText, setIntroText] = useState('');
  const [detailsText, setDetailsText] = useState('');
  const [journalSaving, setJournalSaving] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState<'ALL' | 'NEW' | 'READ' | 'ARCHIVED'>('ALL');

  const notify = useCallback((type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  useEffect(() => {
    setHeroDraft(liveHeroImage);
  }, [liveHeroImage]);

  useEffect(() => {
    setPracticeDraft(livePracticeImage);
  }, [livePracticeImage]);

  useEffect(() => {
    setModelDraft(liveModelImage);
  }, [liveModelImage]);

  useEffect(() => {
    setConfirmDeleteTarget(null);
  }, [activeTab]);

  const loadAuthStatus = useCallback(async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/status');
      if (res.ok) {
        const json = (await res.json()) as AuthStatusResponse;
        setAuthStatus(json);
      }
    } catch {
      setAuthError('Unable to reach server.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAuthStatus();
  }, [loadAuthStatus]);

  const adminFetch = useCallback(
    async (url: string, init: RequestInit = {}) => {
      if (!token) throw new Error('Not authenticated');
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${token}`);
      if (
        init.body &&
        !(init.body instanceof FormData) &&
        !headers.has('Content-Type')
      ) {
        headers.set('Content-Type', 'application/json');
      }
      const res = await fetch(url, { ...init, headers });
      if (res.status === 401) {
        setToken(null);
        notify('err', 'Session expired. Please sign in again.');
      }
      return res;
    },
    [token, notify],
  );

  const refreshAdminStatus = useCallback(async () => {
    if (!token) return true;
    try {
      const statusRes = await adminFetch('/api/admin/status');
      if (statusRes.ok) {
        const statusJson = (await statusRes.json()) as Partial<AdminStorageState>;
        const canPersist = statusJson.persistenceEnabled ?? true;
        setAdminStorage((prev) => ({
          tursoCloud: Boolean(statusJson.tursoCloud),
          persistenceEnabled: canPersist,
          cloudinaryConfigured: Boolean(statusJson.cloudinaryConfigured),
          sync: statusJson.sync ?? prev.sync,
          counts: statusJson.counts ?? prev.counts,
        }));
        return canPersist;
      }
    } catch {
      // Keep prior status cleanly
    }
    return true;
  }, [token, adminFetch]);

  const fetchAdminStatusAndEnquiries = useCallback(async () => {
    if (!token) return;
    setEnquiriesLoading(true);
    try {
      const canPersist = await refreshAdminStatus();

      if (!canPersist) {
        setEnquiries([]);
        return;
      }

      const res = await adminFetch('/api/admin/enquiries');
      if (res.ok) {
        const json = (await res.json()) as { enquiries?: EnquiryItem[] };
        setEnquiries(Array.isArray(json.enquiries) ? json.enquiries : []);
      } else if (res.status === 503) {
        setEnquiries([]);
      }
    } catch {
      notify('err', 'Unable to load contact enquiries.');
    } finally {
      setEnquiriesLoading(false);
    }
  }, [token, adminFetch, refreshAdminStatus, notify]);

  const fetchEnquiries = fetchAdminStatusAndEnquiries;

  useEffect(() => {
    if (token) {
      void fetchAdminStatusAndEnquiries();
    }
  }, [token, fetchAdminStatusAndEnquiries]);

  const handleUploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!token) return null;

      const allowedTypes = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ]);
      if (!allowedTypes.has(file.type)) {
        notify(
          'err',
          'Unsupported file format. Please upload JPEG, PNG, WEBP, or GIF.',
        );
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        notify('err', 'File upload rejected (5MB max).');
        return null;
      }

      try {
        // 1. Request signed Cloudinary upload parameters from our server
        const signRes = await adminFetch('/api/admin/upload/sign', {
          method: 'POST',
        });
        const signBody = (await signRes.json().catch(() => ({}))) as {
          signature?: string;
          timestamp?: number;
          folder?: string;
          allowed_formats?: string;
          api_key?: string;
          cloud_name?: string;
          error?: string;
        };

        if (
          !signRes.ok ||
          !signBody.signature ||
          !signBody.timestamp ||
          !signBody.api_key ||
          !signBody.cloud_name
        ) {
          notify('err', signBody.error || 'Cloudinary upload is not configured.');
          return null;
        }

        // 2. Upload directly from browser to Cloudinary (bypasses serverless body limit)
        const cloudFormData = new FormData();
        cloudFormData.append('file', file);
        cloudFormData.append('api_key', signBody.api_key);
        cloudFormData.append('timestamp', String(signBody.timestamp));
        cloudFormData.append('signature', signBody.signature);
        if (signBody.folder) {
          cloudFormData.append('folder', signBody.folder);
        }
        if (signBody.allowed_formats) {
          cloudFormData.append('allowed_formats', signBody.allowed_formats);
        }

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(signBody.cloud_name)}/image/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          },
        );
        const cloudBody = (await cloudRes.json().catch(() => ({}))) as {
          secure_url?: string;
          error?: { message?: string };
        };

        if (!cloudRes.ok || !cloudBody.secure_url) {
          notify(
            'err',
            cloudBody.error?.message || 'Cloudinary upload failed.',
          );
          return null;
        }

        // 3. Confirm & verify uploaded URL against configured cloud name on server
        const verifyRes = await adminFetch('/api/admin/upload/verify', {
          method: 'POST',
          body: JSON.stringify({ url: cloudBody.secure_url }),
        });
        const verifyBody = (await verifyRes.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };

        if (!verifyRes.ok || !verifyBody.url) {
          notify('err', verifyBody.error || 'Could not verify uploaded asset.');
          return null;
        }

        notify('ok', 'Image uploaded to Cloudinary.');
        return verifyBody.url;
      } catch {
        notify('err', 'Network error uploading image.');
        return null;
      }
    },
    [token, adminFetch, notify],
  );

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password.trim().length < 8) {
      setAuthError('Password must have at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        token?: string;
        error?: string;
      };
      if (!res.ok || !body.token) {
        setAuthError(body.error || 'Unable to initialize admin credentials.');
        return;
      }
      setToken(body.token);
      setPassword('');
      setConfirmPassword('');
      await loadAuthStatus();
    } catch {
      setAuthError('Connection error.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!password.trim()) {
      setAuthError('Enter your admin password.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        token?: string;
        error?: string;
      };
      if (!res.ok || !body.token) {
        setAuthError(body.error || 'Invalid credentials.');
        return;
      }
      setToken(body.token);
      setPassword('');
    } catch {
      setAuthError('Connection error.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // --- Save & Delete Handlers ---

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroDraft.trim()) {
      notify('err', 'Please upload a Hero image before saving.');
      return;
    }
    setHeroSaving(true);
    try {
      const res = await adminFetch('/api/admin/hero', {
        method: 'PUT',
        body: JSON.stringify({
          heroImage: heroDraft.trim(),
          practiceImage: practiceDraft.trim() || undefined,
          modelImage: modelDraft.trim() || undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to update site images.');
        return;
      }
      await refreshPortfolio();
      await refreshAdminStatus();
      notify('ok', 'Site images saved to database.');
    } catch {
      notify('err', 'Network error saving site images.');
    } finally {
      setHeroSaving(false);
    }
  };

  const startEditCategory = (cat: PortfolioCategoryItem) => {
    setConfirmDeleteTarget(null);
    setEditingCategoryId(cat.id);
    setCategoryDraft({ ...cat });
    window.requestAnimationFrame(() => {
      categoryFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    const nextCode = String(categories.length + 1).padStart(2, '0');
    setCategoryDraft({ ...EMPTY_CATEGORY, code: nextCode });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryDraft.image.trim()) {
      notify('err', 'Please upload a category thumbnail image.');
      return;
    }
    setCategorySaving(true);
    try {
      const isEdit = editingCategoryId !== null;
      const endpoint = isEdit
        ? `/api/admin/categories?id=${encodeURIComponent(editingCategoryId)}`
        : '/api/admin/categories';
      const res = await adminFetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...categoryDraft,
          ...(isEdit ? { id: editingCategoryId } : {}),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to save category.');
        return;
      }
      await refreshPortfolio();
      await refreshAdminStatus();
      resetCategoryForm();
      notify('ok', isEdit ? 'Category updated.' : 'Category created.');
    } catch {
      notify('err', 'Network error saving category.');
    } finally {
      setCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const key = `category:${id}`;
    setDeletingKey(key);
    try {
      const res = await adminFetch(
        `/api/admin/categories?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to delete category.');
        if (res.status === 404) {
          await refreshPortfolio();
        }
        return;
      }
      setConfirmDeleteTarget(null);
      if (editingCategoryId === id) resetCategoryForm();
      await refreshPortfolio();
      await refreshAdminStatus();
      notify('ok', 'Category deleted.');
    } catch {
      notify('err', 'Network error deleting category.');
    } finally {
      setDeletingKey(null);
    }
  };

  const startEditWork = (work: ProjectItem) => {
    setConfirmDeleteTarget(null);
    setEditingWorkId(work.id);
    setWorkDraft({
      ...work,
      gallery: [...work.gallery] as [string, string, string],
      steps: [
        { ...work.steps[0] },
        { ...work.steps[1] },
        { ...work.steps[2] },
      ],
    });
    window.requestAnimationFrame(() => {
      workFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  const resetWorkForm = () => {
    setEditingWorkId(null);
    const nextFloor = String(projects.length + 1).padStart(2, '0');
    setWorkDraft({
      ...createEmptyProject(categories[0]?.id ?? 'STONE'),
      floor: nextFloor,
    });
  };

  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDraft.image.trim()) {
      notify('err', 'Please upload the primary artwork image.');
      return;
    }
    setWorkSaving(true);
    try {
      const isEdit = editingWorkId !== null;
      const endpoint = isEdit
        ? `/api/admin/projects/${encodeURIComponent(editingWorkId)}`
        : '/api/admin/projects';
      const primary = workDraft.image.trim();
      const payload = {
        ...workDraft,
        gallery: [
          workDraft.gallery[0].trim() || primary,
          workDraft.gallery[1].trim() || primary,
          workDraft.gallery[2].trim() || primary,
        ],
      };
      const res = await adminFetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to save artwork.');
        return;
      }
      await refreshPortfolio();
      await refreshAdminStatus();
      resetWorkForm();
      notify('ok', isEdit ? 'Artwork updated.' : 'Artwork published.');
    } catch {
      notify('err', 'Network error saving artwork.');
    } finally {
      setWorkSaving(false);
    }
  };

  const handleDeleteWork = async (id: string) => {
    const key = `work:${id}`;
    setDeletingKey(key);
    try {
      const res = await adminFetch(
        `/api/admin/projects/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to delete artwork.');
        if (res.status === 404) {
          await refreshPortfolio();
        }
        return;
      }
      setConfirmDeleteTarget(null);
      if (editingWorkId === id) resetWorkForm();
      await refreshPortfolio();
      await refreshAdminStatus();
      notify('ok', 'Artwork removed.');
    } catch {
      notify('err', 'Network error deleting artwork.');
    } finally {
      setDeletingKey(null);
    }
  };

  const startEditJournal = (entry: JournalEntry) => {
    setConfirmDeleteTarget(null);
    setEditingJournalId(entry.id);
    setJournalDraft({ ...entry });
    setIntroText(entry.introParagraphs.join('\n\n'));
    setDetailsText(entry.details.join('\n'));
    window.requestAnimationFrame(() => {
      journalFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  const resetJournalForm = () => {
    setEditingJournalId(null);
    setJournalDraft(EMPTY_JOURNAL);
    setIntroText('');
    setDetailsText('');
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalDraft.image.trim()) {
      notify('err', 'Please upload a cover photograph for this entry.');
      return;
    }
    setJournalSaving(true);
    try {
      const isEdit = editingJournalId !== null;
      const endpoint = isEdit
        ? `/api/admin/journal/${encodeURIComponent(editingJournalId)}`
        : '/api/admin/journal';
      const introParagraphs = introText
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);
      const details = detailsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: JournalEntry = {
        ...journalDraft,
        introParagraphs:
          introParagraphs.length > 0
            ? introParagraphs
            : [journalDraft.subtitle.trim()],
        details:
          details.length > 0 ? details : [journalDraft.subtitle.trim()],
      };

      const res = await adminFetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to save journal entry.');
        return;
      }
      await refreshPortfolio();
      await refreshAdminStatus();
      resetJournalForm();
      notify('ok', isEdit ? 'Journal entry updated.' : 'Journal entry published.');
    } catch {
      notify('err', 'Network error saving journal entry.');
    } finally {
      setJournalSaving(false);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    const key = `journal:${id}`;
    setDeletingKey(key);
    try {
      const res = await adminFetch(
        `/api/admin/journal/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to delete journal entry.');
        if (res.status === 404) {
          await refreshPortfolio();
        }
        return;
      }
      setConfirmDeleteTarget(null);
      if (editingJournalId === id) resetJournalForm();
      await refreshPortfolio();
      await refreshAdminStatus();
      notify('ok', 'Journal entry deleted.');
    } catch {
      notify('err', 'Network error deleting journal entry.');
    } finally {
      setDeletingKey(null);
    }
  };

  const handleUpdateEnquiryStatus = async (
    id: string,
    status: EnquiryItem['status'],
  ) => {
    try {
      const res = await adminFetch(
        `/api/admin/enquiries/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to update status.');
        return;
      }
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      notify('err', 'Network error updating enquiry status.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    const key = `enquiry:${id}`;
    setDeletingKey(key);
    try {
      const res = await adminFetch(
        `/api/admin/enquiries/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        notify('err', body.error || 'Unable to delete enquiry.');
        return;
      }
      setConfirmDeleteTarget(null);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      notify('ok', 'Enquiry deleted.');
    } catch {
      notify('err', 'Network error deleting enquiry.');
    } finally {
      setDeletingKey(null);
    }
  };

  const handleMigrateToCloud = async () => {
    if (
      !adminStorage.tursoCloud ||
      !adminStorage.cloudinaryConfigured ||
      migrating
    ) {
      return;
    }

    setMigrating(true);
    try {
      const res = await adminFetch('/api/admin/migrate', {
        method: 'POST',
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        imagesUploaded?: number;
        sync?: AdminSyncStats;
        counts?: AdminStorageCounts;
        error?: string;
      };

      if (!res.ok || !body.ok) {
        notify(
          'err',
          body.error || 'Migration failed. Verify Turso & Cloudinary credentials.',
        );
        return;
      }

      if (body.sync || body.counts) {
        setAdminStorage((prev) => ({
          ...prev,
          sync: body.sync ?? prev.sync,
          counts: body.counts ?? prev.counts,
        }));
      }

      const uploadedCount = body.imagesUploaded ?? 0;
      const percent = body.sync?.syncedPercent ?? 100;
      setLastMigrationSummary(
        `Migrated ${uploadedCount} asset(s) to Cloudinary & synchronized all tables to Turso (${percent}%).`,
      );
      await refreshPortfolio();
      await fetchAdminStatusAndEnquiries();
      notify(
        'ok',
        `Cloud sync complete (${percent}% · ${uploadedCount} new upload${uploadedCount === 1 ? '' : 's'}).`,
      );
    } catch {
      notify('err', 'Network error while migrating content to cloud.');
    } finally {
      setMigrating(false);
    }
  };

  const tursoCloud = adminStorage.tursoCloud;
  const persistenceEnabled = adminStorage.persistenceEnabled;
  const cloudinaryConfigured = adminStorage.cloudinaryConfigured;
  const syncStats = adminStorage.sync;
  const canMigrate = tursoCloud && cloudinaryConfigured && !migrating;
  const unreadCount = enquiries.filter((e) => e.status === 'NEW').length;

  const filteredWorks = projects.filter((p) => {
    const q = worksSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.portfolioCategory.toLowerCase().includes(q) ||
      p.year.toLowerCase().includes(q)
    );
  });

  const filteredEnquiries = enquiries.filter((item) =>
    enquiryFilter === 'ALL' ? true : item.status === enquiryFilter,
  );

  // --- Unauthenticated Gate ---
  if (!token) {
    const adminEnabled = authStatus?.adminEnabled ?? true;
    const disabledReason = authStatus?.disabledReason ?? null;
    const needsSetup = adminEnabled && (authStatus?.needsSetup ?? false);

    return (
      <div className="min-h-screen bg-white text-black px-5 sm:px-8 py-10 flex flex-col justify-between">
        <div className="max-w-[1320px] w-full mx-auto flex items-center justify-between pb-6 border-b border-black/15">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-black hover:opacity-60 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>VOLKER SCHNÜTTGEN · PUBLIC SITE</span>
          </button>

          <div className="hidden sm:flex items-center gap-5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#595959]">
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>

        <div className="max-w-[460px] w-full mx-auto my-16 border border-black/20 p-8 sm:p-10 bg-white">
          <div className="flex items-center justify-between pb-6 border-b border-black/15">
            <div>
              <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-[#666666]">
                STUDIO ARCHIVE MANAGEMENT
              </span>
              <h1 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-black">
                {!adminEnabled
                  ? 'Admin Disabled'
                  : needsSetup
                    ? 'Initialize Studio Admin'
                    : 'Admin Sign In'}
              </h1>
            </div>
            <Lock className="w-5 h-5 text-black/70" strokeWidth={1.5} />
          </div>

          {authLoading ? (
            <p className="py-10 font-mono text-[11px] tracking-[0.12em] uppercase text-[#666666]">
              CHECKING STUDIO SECURITY...
            </p>
          ) : !adminEnabled ? (
            <div className="mt-6 space-y-5">
              <p className="text-[14px] leading-[1.6] text-[#404040]">
                {disabledReason ||
                  'Admin authentication is disabled until required server environment variables are configured.'}
              </p>
              <div className="border border-black/15 bg-[#fafafa] px-4 py-3.5 font-mono text-[10px] tracking-[0.08em] uppercase text-[#595959] space-y-1.5">
                <div>PUBLIC PORTFOLIO: ACTIVE (READ-ONLY)</div>
                <div>
                  REQUIRED ENV: SESSION_SECRET &amp; ADMIN_PASSCODE
                </div>
              </div>
              <button
                type="button"
                onClick={onExit}
                className="w-full inline-flex items-center justify-between border border-black px-5 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase bg-black text-white hover:bg-black/85 transition-colors cursor-pointer"
              >
                <span>RETURN TO PUBLIC SITE</span>
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          ) : needsSetup ? (
            <form onSubmit={handleSetupAdmin} className="mt-6 space-y-6">
              <p className="text-[14px] leading-[1.6] text-[#404040]">
                Create your master admin password to claim this studio console.
                Once set, the password protects Journal publishing, Portfolio works,
                Categories, Hero imagery, and the Contact inbox.
              </p>

              <div>
                <label
                  htmlFor="setup-password"
                  className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                >
                  NEW ADMIN PASSWORD (MIN 8 CHARS)
                </label>
                <input
                  id="setup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2.5 text-[15px] text-black focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="setup-confirm"
                  className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  id="setup-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2.5 text-[15px] text-black focus:outline-none"
                />
              </div>

              {authError && (
                <p className="font-mono text-[11px] text-red-700 border border-red-300 bg-red-50 px-3 py-2.5">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full inline-flex items-center justify-between border border-black px-5 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase bg-black text-white hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>{authSubmitting ? 'INITIALIZING...' : 'CLAIM ADMIN ACCESS'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-6 space-y-6">
              <p className="text-[14px] leading-[1.6] text-[#404040]">
                Enter the studio admin password to manage works, categories,
                journal entries, Hero imagery, and incoming enquiries.
              </p>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666] mb-1.5"
                >
                  ADMIN PASSWORD
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2.5 text-[15px] text-black focus:outline-none"
                />
              </div>

              {authError && (
                <p className="font-mono text-[11px] text-red-700 border border-red-300 bg-red-50 px-3 py-2.5">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full inline-flex items-center justify-between border border-black px-5 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase bg-black text-white hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>{authSubmitting ? 'SIGNING IN...' : 'ENTER STUDIO ADMIN'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>

        <div className="max-w-[1320px] w-full mx-auto pt-6 border-t border-black/15 flex flex-wrap justify-between gap-4 font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666]">
          <span>VOLKER SCHNÜTTGEN ARCHIVE SYSTEM</span>
          <span>PRIVATE ACCESS</span>
        </div>
      </div>
    );
  }

  // --- Authenticated Studio Console ---
  const adminNavItems: Array<{
    id: AdminTab;
    code: string;
    label: string;
    meta: string;
  }> = [
    {
      id: 'enquiries',
      code: '01',
      label: 'CONTACT INBOX',
      meta: unreadCount > 0 ? `${unreadCount} NEW` : String(enquiries.length),
    },
    {
      id: 'hero',
      code: '02',
      label: 'SITE IMAGES',
      meta: '03',
    },
    {
      id: 'categories',
      code: '03',
      label: 'CATEGORIES',
      meta: String(categories.length).padStart(2, '0'),
    },
    {
      id: 'works',
      code: '04',
      label: 'WORKS / OBRAS',
      meta: String(projects.length).padStart(2, '0'),
    },
    {
      id: 'journal',
      code: '05',
      label: 'JOURNAL',
      meta: String(journalEntries.length).padStart(2, '0'),
    },
    {
      id: 'sync',
      code: '06',
      label: 'CLOUD SYNC',
      meta: `${syncStats.syncedPercent}%`,
    },
  ];

  const activeNavItem =
    adminNavItems.find((item) => item.id === activeTab) ?? adminNavItems[0];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Desktop Fixed Left Lateral Admin Sidebar */}
      <aside
        aria-label="Admin section navigation"
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[264px] lg:w-[280px] bg-white border-r border-black/15 flex-col justify-between select-none"
      >
        <div>
          {/* Brand & Back to Site */}
          <div className="px-6 pt-7 pb-6 border-b border-black/15">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[20px] font-semibold tracking-tight text-black">
                VS.
              </span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#666666]">
                ADMIN CONSOLE
              </span>
            </div>
            <h1 className="mt-3 text-[16px] font-normal tracking-[-0.015em] text-black leading-snug">
              Volker Schnüttgen Archive
            </h1>
            <button
              type="button"
              onClick={onExit}
              className="mt-5 w-full inline-flex items-center justify-between border border-black/25 px-3.5 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <span>BACK TO SITE</span>
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Vertical Navigation Menu */}
          <nav className="border-b border-black/15">
            {adminNavItems.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full border-t border-black/15 px-6 py-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black/[0.04]'
                  }`}
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className={`font-mono text-[11px] tracking-[0.08em] tabular-nums ${
                        active ? 'text-[#B3B3B3]' : 'text-[#666666]'
                      }`}
                    >
                      {tab.code}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase truncate">
                      {tab.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] tracking-[0.08em] tabular-nums shrink-0 ${
                      active ? 'text-white' : 'text-[#595959]'
                    }`}
                  >
                    {tab.meta}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storage Status & Session Controls */}
        <div className="p-6 border-t border-black/15 space-y-4">
          <div className="space-y-1.5 font-mono text-[10px] tracking-[0.1em] uppercase">
            <div className="flex items-center justify-between text-[#595959]">
              <span>DB</span>
              <span className="text-black">
                {tursoCloud
                  ? 'TURSO CLOUD'
                  : persistenceEnabled
                    ? 'LOCAL SQLITE'
                    : 'READ-ONLY SEED'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#595959]">
              <span>MEDIA</span>
              <span className="text-black">
                {cloudinaryConfigured ? 'CLOUDINARY OK' : 'MISSING'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                void refreshPortfolio();
                void fetchEnquiries();
              }}
              className="inline-flex items-center justify-center gap-1.5 border border-black/25 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
              <span>SYNC</span>
            </button>
            <button
              type="button"
              onClick={() => setToken(null)}
              className="inline-flex items-center justify-center gap-1.5 border border-black bg-black text-white py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black/80 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" strokeWidth={1.5} />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Compact Header + Nav */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-black/15 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 border border-black/25 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            <span>SITE</span>
          </button>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-black">
            STUDIO ADMIN
          </span>
          <button
            type="button"
            onClick={() => setToken(null)}
            className="inline-flex items-center gap-1 border border-black bg-black text-white px-2.5 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase cursor-pointer"
          >
            <LogOut className="w-3 h-3" strokeWidth={1.5} />
            <span>OUT</span>
          </button>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto pb-0.5">
          {adminNavItems.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase border whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black/25'
                }`}
              >
                {tab.label} ({tab.meta})
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area Offset by Left Lateral Sidebar */}
      <div className="md:pl-[264px] lg:pl-[280px]">
        {/* Desktop Active Section Eyebrow Header */}
        <div className="hidden md:flex items-center justify-between px-8 lg:px-12 py-5 border-b border-black/15 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#666666] tabular-nums">
              {activeNavItem.code}
            </span>
            <span className="text-black/20">/</span>
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black">
              {activeNavItem.label}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666]">
            {tursoCloud
              ? 'TURSO CLOUD'
              : persistenceEnabled
                ? 'LOCAL SQLITE'
                : 'READ-ONLY SEED'}{' '}
            ·{' '}
            {cloudinaryConfigured ? 'CLOUDINARY READY' : 'CLOUDINARY MISSING'}
          </span>
        </div>

        {/* Integration Notice if Turso or Cloudinary not yet configured */}
        {(!tursoCloud || !cloudinaryConfigured) && (
          <div className="max-w-[1260px] mx-auto px-5 sm:px-8 lg:px-12 mt-6">
            <div className="border border-black/25 bg-[#fafafa] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-[13px] leading-[1.5] text-[#262626]">
                <strong className="font-mono text-[10px] tracking-[0.12em] uppercase mr-2">
                  CLOUD SETUP PENDING:
                </strong>
                {!tursoCloud &&
                  (persistenceEnabled
                    ? 'Using local SQLite (local-studio.db) until TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are configured. '
                    : 'Running on read-only seed data until TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are configured. ')}
                {!cloudinaryConfigured &&
                  'Image uploads and Cloud Migration remain disabled until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are configured.'}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('sync')}
                className="border border-black/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer shrink-0"
              >
                VIEW CLOUD SYNC
              </button>
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {toast && (
          <div className="max-w-[1260px] mx-auto px-5 sm:px-8 lg:px-12 mt-4">
            <div
              className={`px-4 py-3 border font-mono text-[11px] tracking-[0.08em] uppercase flex items-center justify-between ${
                toast.type === 'ok'
                  ? 'border-black bg-black text-white'
                  : 'border-red-500 bg-red-50 text-red-800'
              }`}
            >
              <span>{toast.text}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="underline cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        <main className="max-w-[1260px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        {/* ================= TAB 1: ENQUIRIES ================= */}
        {activeTab === 'enquiries' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-black/20">
              <div>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  CONTACT FORM SUBMISSIONS
                </span>
                <h2 className="mt-1 text-[30px] font-normal tracking-[-0.02em]">
                  Enquiries Inbox
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['ALL', 'NEW', 'READ', 'ARCHIVED'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setEnquiryFilter(status)}
                    className={`px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase border cursor-pointer ${
                      enquiryFilter === status
                        ? 'bg-black text-white border-black'
                        : 'border-black/25 text-black hover:border-black'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {enquiriesLoading ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#666666]">
                LOADING ENQUIRIES...
              </p>
            ) : filteredEnquiries.length === 0 ? (
              <div className="border border-black/15 p-10 text-center">
                <p className="text-[16px] text-[#595959]">
                  No contact submissions match this filter yet. Enquiries sent
                  through the Contact page will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredEnquiries.map((item) => (
                  <article
                    key={item.id}
                    className="border border-black/20 p-6 bg-white space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-black/10">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase border ${
                              item.status === 'NEW'
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-[#595959] border-black/25'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#595959]">
                            {item.subject}
                            {item.scope ? ` · ${item.scope}` : ''}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[20px] font-normal text-black">
                          {item.name}{' '}
                          <span className="text-[#595959] text-[15px]">
                            ({item.email})
                          </span>
                        </h3>
                        {(item.organisation || item.location) && (
                          <p className="mt-1 font-mono text-[11px] tracking-[0.08em] uppercase text-[#666666]">
                            {[item.organisation, item.location]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                      </div>

                      <div className="text-right font-mono text-[10px] tracking-[0.1em] uppercase text-[#666666]">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-[15px] leading-[1.65] text-[#1a1a1a] whitespace-pre-wrap">
                      {item.message}
                    </p>

                    <div className="pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {item.status !== 'READ' && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleUpdateEnquiryStatus(item.id, 'READ')
                            }
                            className="inline-flex items-center gap-1.5 border border-black/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>MARK READ</span>
                          </button>
                        )}
                        {item.status !== 'ARCHIVED' && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleUpdateEnquiryStatus(item.id, 'ARCHIVED')
                            }
                            className="border border-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#404040] hover:border-black cursor-pointer"
                          >
                            ARCHIVE
                          </button>
                        )}
                        {item.status !== 'NEW' && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleUpdateEnquiryStatus(item.id, 'NEW')
                            }
                            className="border border-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#404040] hover:border-black cursor-pointer"
                          >
                            REOPEN NEW
                          </button>
                        )}
                      </div>

                      {confirmDeleteTarget?.type === 'enquiry' &&
                      confirmDeleteTarget.id === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={deletingKey === `enquiry:${item.id}`}
                            onClick={() => void handleDeleteEnquiry(item.id)}
                            className="border border-red-700 bg-red-700 text-white px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-red-800 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {deletingKey === `enquiry:${item.id}`
                              ? 'DELETING...'
                              : 'CONFIRM DELETE'}
                          </button>
                          <button
                            type="button"
                            disabled={deletingKey === `enquiry:${item.id}`}
                            onClick={() => setConfirmDeleteTarget(null)}
                            className="border border-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:border-black cursor-pointer disabled:opacity-50"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDeleteTarget({
                              type: 'enquiry',
                              id: item.id,
                            })
                          }
                          className="inline-flex items-center gap-1.5 border border-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-red-700 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>DELETE</span>
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 2: HERO & SITE IMAGES ================= */}
        {activeTab === 'hero' && (
          <section className="max-w-[920px] space-y-8">
            <div className="pb-5 border-b border-black/20">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                LANDING OPENING &amp; EDITORIAL VISUALS
              </span>
              <h2 className="mt-1 text-[30px] font-normal tracking-[-0.02em]">
                Hero &amp; Studio Images
              </h2>
            </div>

            <form
              onSubmit={handleSaveHero}
              className="space-y-8 border border-black/20 p-6 sm:p-8"
            >
              <ImageField
                label="HERO FULL-BLEED PHOTOGRAPH"
                value={heroDraft}
                onChange={setHeroDraft}
                onUploadFile={handleUploadImage}
                cloudinaryConfigured={cloudinaryConfigured}
                previewAspect="aspect-[16/9]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-black/15">
                <ImageField
                  label="PRACTICE SECTION PHOTOGRAPH"
                  value={practiceDraft}
                  onChange={setPracticeDraft}
                  onUploadFile={handleUploadImage}
                  cloudinaryConfigured={cloudinaryConfigured}
                  previewAspect="aspect-[4/4]"
                />
                <ImageField
                  label="STUDIO SECTION PHOTOGRAPH"
                  value={modelDraft}
                  onChange={setModelDraft}
                  onUploadFile={handleUploadImage}
                  cloudinaryConfigured={cloudinaryConfigured}
                  previewAspect="aspect-[4/4]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/15">
                <button
                  type="button"
                  onClick={() => {
                    setHeroDraft(liveHeroImage);
                    setPracticeDraft(livePracticeImage);
                    setModelDraft(liveModelImage);
                  }}
                  className="border border-black/25 px-4 py-3 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:border-black cursor-pointer"
                >
                  REVERT TO SAVED
                </button>
                <button
                  type="submit"
                  disabled={heroSaving}
                  className="inline-flex items-center gap-3 border border-black bg-black text-white px-6 py-3 font-mono text-[10px] tracking-[0.14em] uppercase hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>
                    {heroSaving ? 'SAVING...' : 'UPDATE SITE IMAGES'}
                  </span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ================= TAB 3: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* List */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-end justify-between pb-4 border-b border-black/20">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    PORTFOLIO TAXONOMY
                  </span>
                  <h2 className="mt-1 text-[28px] font-normal tracking-[-0.02em]">
                    Categories ({categories.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="inline-flex items-center gap-1.5 border border-black px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW CATEGORY</span>
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => {
                  const isConfirming =
                    confirmDeleteTarget?.type === 'category' &&
                    confirmDeleteTarget.id === cat.id;
                  const isDeleting = deletingKey === `category:${cat.id}`;
                  const linkedWorksCount = projects.filter(
                    (p) => p.portfolioCategory === cat.id,
                  ).length;

                  return (
                    <div
                      key={cat.id}
                      className={`border p-4 flex items-center gap-4 ${
                        editingCategoryId === cat.id
                          ? 'border-black bg-[#fafafa]'
                          : 'border-black/20 bg-white'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-14 h-20 object-cover border border-black/15 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666]">
                          {cat.code} · ID: {cat.id}
                        </span>
                        <h3 className="text-[18px] font-normal text-black truncate">
                          {cat.title}
                        </h3>
                        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#595959] truncate">
                          {cat.categoryLine}
                        </p>
                        {isConfirming && linkedWorksCount > 0 && (
                          <p className="mt-1 font-mono text-[9px] tracking-[0.08em] uppercase text-red-700">
                            {linkedWorksCount} ARTWORK{linkedWorksCount === 1 ? '' : 'S'} LINKED
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => startEditCategory(cat)}
                          className="border border-black/30 px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black hover:text-white cursor-pointer disabled:opacity-50"
                        >
                          EDIT
                        </button>
                        {isConfirming ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => void handleDeleteCategory(cat.id)}
                              className="border border-red-700 bg-red-700 text-white px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase hover:bg-red-800 cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? '...' : 'CONFIRM'}
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteTarget(null)}
                              className="border border-black/25 px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase text-black hover:border-black cursor-pointer disabled:opacity-50"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDeleteTarget({
                                type: 'category',
                                id: cat.id,
                              })
                            }
                            className="border border-black/20 px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form
              ref={categoryFormRef}
              onSubmit={handleSaveCategory}
              className="lg:col-span-6 border border-black/20 p-6 sm:p-8 space-y-6 bg-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/15">
                <h3 className="text-[22px] font-normal">
                  {editingCategoryId
                    ? `Edit Category: ${editingCategoryId}`
                    : 'Create New Category'}
                </h3>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase underline cursor-pointer"
                  >
                    CANCEL EDIT
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    INDEX CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryDraft.code}
                    onChange={(e) =>
                      setCategoryDraft((d) => ({ ...d, code: e.target.value }))
                    }
                    placeholder="05"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CATEGORY TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryDraft.title}
                    onChange={(e) =>
                      setCategoryDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    placeholder="Bronze"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
              </div>

              {!editingCategoryId && (
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CATEGORY KEY (OPTIONAL, AUTO-GENERATED FROM TITLE)
                  </label>
                  <input
                    type="text"
                    value={categoryDraft.id}
                    onChange={(e) =>
                      setCategoryDraft((d) => ({ ...d, id: e.target.value }))
                    }
                    placeholder="BRONZE"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] uppercase focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  SUBTITLE LINE *
                </label>
                <input
                  type="text"
                  required
                  value={categoryDraft.categoryLine}
                  onChange={(e) =>
                    setCategoryDraft((d) => ({
                      ...d,
                      categoryLine: e.target.value,
                    }))
                  }
                  placeholder="CAST METAL · PATINA & WEIGHT"
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  META LINE
                </label>
                <input
                  type="text"
                  value={categoryDraft.metaLine}
                  onChange={(e) =>
                    setCategoryDraft((d) => ({ ...d, metaLine: e.target.value }))
                  }
                  placeholder="EDITION · EDITIONED WORKS"
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                />
              </div>

              <ImageField
                label="CATEGORY VERTICAL THUMBNAIL (3:4) *"
                value={categoryDraft.image}
                onChange={(url) =>
                  setCategoryDraft((d) => ({ ...d, image: url }))
                }
                onUploadFile={handleUploadImage}
                cloudinaryConfigured={cloudinaryConfigured}
                previewAspect="aspect-[3/4] max-w-[180px]"
              />

              <button
                type="submit"
                disabled={categorySaving}
                className="w-full border border-black bg-black text-white py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                {categorySaving
                  ? 'SAVING...'
                  : editingCategoryId
                    ? 'SAVE CATEGORY CHANGES'
                    : 'CREATE CATEGORY'}
              </button>
            </form>
          </section>
        )}

        {/* ================= TAB 4: WORKS / OBRAS ================= */}
        {activeTab === 'works' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Works list */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-end justify-between pb-4 border-b border-black/20">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    CATALOGUE ARCHIVE
                  </span>
                  <h2 className="mt-1 text-[28px] font-normal tracking-[-0.02em]">
                    Artworks ({projects.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetWorkForm}
                  className="inline-flex items-center gap-1.5 border border-black px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW WORK</span>
                </button>
              </div>

              <input
                type="text"
                value={worksSearch}
                onChange={(e) => setWorksSearch(e.target.value)}
                placeholder="Filter works by title, category, or year..."
                className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
              />

              <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
                {filteredWorks.map((work) => {
                  const isConfirming =
                    confirmDeleteTarget?.type === 'work' &&
                    confirmDeleteTarget.id === work.id;
                  const isDeleting = deletingKey === `work:${work.id}`;

                  return (
                    <div
                      key={work.id}
                      className={`border p-3.5 flex items-center gap-3.5 ${
                        editingWorkId === work.id
                          ? 'border-black bg-[#fafafa]'
                          : 'border-black/20 bg-white'
                      }`}
                    >
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-14 h-16 object-cover border border-black/15 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#666666]">
                          {work.floor} · {work.portfolioCategory} · {work.year}
                        </span>
                        <h3 className="text-[16px] font-normal text-black truncate">
                          {work.title}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => startEditWork(work)}
                          className="border border-black/30 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase hover:bg-black hover:text-white cursor-pointer disabled:opacity-50"
                        >
                          EDIT
                        </button>
                        {isConfirming ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => void handleDeleteWork(work.id)}
                              className="border border-red-700 bg-red-700 text-white px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase hover:bg-red-800 cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? '...' : 'OK'}
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteTarget(null)}
                              className="border border-black/25 px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase text-black hover:border-black cursor-pointer disabled:opacity-50"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDeleteTarget({
                                type: 'work',
                                id: work.id,
                              })
                            }
                            className="border border-black/20 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                          >
                            DEL
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Work editor */}
            <form
              ref={workFormRef}
              onSubmit={handleSaveWork}
              className="lg:col-span-7 border border-black/20 p-6 sm:p-8 space-y-6 bg-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/15">
                <h3 className="text-[22px] font-normal">
                  {editingWorkId ? `Edit Work: ${workDraft.title}` : 'Add New Artwork'}
                </h3>
                {editingWorkId && (
                  <button
                    type="button"
                    onClick={resetWorkForm}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase underline cursor-pointer"
                  >
                    CANCEL EDIT
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    INDEX NO.
                  </label>
                  <input
                    type="text"
                    value={workDraft.floor}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, floor: e.target.value }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={workDraft.title}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    placeholder="Sintra Monolith"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    YEAR *
                  </label>
                  <input
                    type="text"
                    required
                    value={workDraft.year}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, year: e.target.value }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    PORTFOLIO CATEGORY *
                  </label>
                  <select
                    value={workDraft.portfolioCategory}
                    onChange={(e) =>
                      setWorkDraft((d) => ({
                        ...d,
                        portfolioCategory: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  >
                    {workDraft.portfolioCategory &&
                      !categories.some(
                        (cat) => cat.id === workDraft.portfolioCategory,
                      ) && (
                        <option value={workDraft.portfolioCategory}>
                          {workDraft.portfolioCategory} (ARCHIVED)
                        </option>
                      )}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title} ({cat.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    TYPOLOGY
                  </label>
                  <select
                    value={workDraft.typology}
                    onChange={(e) =>
                      setWorkDraft((d) => ({
                        ...d,
                        typology: e.target.value as ProjectItem['typology'],
                      }))
                    }
                    className="w-full bg-transparent border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  >
                    <option value="SCULPTURE">SCULPTURE</option>
                    <option value="INSTALLATION">INSTALLATION</option>
                    <option value="SITE & PUBLIC">SITE & PUBLIC</option>
                    <option value="SERIES">SERIES</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={workDraft.location}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, location: e.target.value }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    MEDIUM
                  </label>
                  <input
                    type="text"
                    value={workDraft.medium}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, medium: e.target.value }))
                    }
                    placeholder="OAK WOOD · STONE"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CONTEXT / EXHIBITION
                  </label>
                  <input
                    type="text"
                    value={workDraft.context}
                    onChange={(e) =>
                      setWorkDraft((d) => ({ ...d, context: e.target.value }))
                    }
                    placeholder="ZET GALLERY · 2026"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  LEAD DESCRIPTION *
                </label>
                <textarea
                  rows={3}
                  required
                  value={workDraft.lead}
                  onChange={(e) =>
                    setWorkDraft((d) => ({ ...d, lead: e.target.value }))
                  }
                  placeholder="Concise description of the work..."
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                />
              </div>

              <ImageField
                label="PRIMARY ARTWORK IMAGE *"
                value={workDraft.image}
                onChange={(url) =>
                  setWorkDraft((d) => ({ ...d, image: url }))
                }
                onUploadFile={handleUploadImage}
                cloudinaryConfigured={cloudinaryConfigured}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-black/15">
                {([0, 1, 2] as const).map((idx) => (
                  <ImageField
                    key={idx}
                    label={`GALLERY PHOTO ${idx + 1}`}
                    value={workDraft.gallery[idx] ?? ''}
                    onChange={(url) =>
                      setWorkDraft((d) => {
                        const next: [string, string, string] = [...d.gallery] as [
                          string,
                          string,
                          string,
                        ];
                        next[idx] = url;
                        return { ...d, gallery: next };
                      })
                    }
                    onUploadFile={handleUploadImage}
                    cloudinaryConfigured={cloudinaryConfigured}
                    previewAspect="aspect-[4/3]"
                    allowClear
                  />
                ))}
              </div>

              <div className="space-y-4 pt-2 border-t border-black/15">
                <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  NOTES (MATERIAL · FORM · CONTEXT)
                </span>
                {([0, 1, 2] as const).map((idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={workDraft.steps[idx].label}
                      onChange={(e) =>
                        setWorkDraft((d) => {
                          const steps = d.steps.map((s, sIdx) =>
                            sIdx === idx ? { ...s, label: e.target.value } : s,
                          ) as ProjectItem['steps'];
                          return { ...d, steps };
                        })
                      }
                      className="border-b border-black/25 focus:border-black py-1.5 font-mono text-[11px] uppercase focus:outline-none"
                    />
                    <input
                      type="text"
                      value={workDraft.steps[idx].text}
                      onChange={(e) =>
                        setWorkDraft((d) => {
                          const steps = d.steps.map((s, sIdx) =>
                            sIdx === idx ? { ...s, text: e.target.value } : s,
                          ) as ProjectItem['steps'];
                          return { ...d, steps };
                        })
                      }
                      placeholder="Optional note (defaults to lead description if left blank)"
                      className="sm:col-span-3 border-b border-black/25 focus:border-black py-1.5 text-[13px] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={workDraft.featured}
                  onChange={(e) =>
                    setWorkDraft((d) => ({ ...d, featured: e.target.checked }))
                  }
                  className="w-4 h-4 accent-black"
                />
                <span>FEATURED WORK</span>
              </label>

              <button
                type="submit"
                disabled={workSaving}
                className="w-full border border-black bg-black text-white py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                {workSaving
                  ? 'SAVING...'
                  : editingWorkId
                    ? 'SAVE WORK CHANGES'
                    : 'PUBLISH NEW WORK'}
              </button>
            </form>
          </section>
        )}

        {/* ================= TAB 5: JOURNAL ================= */}
        {activeTab === 'journal' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Journal List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-end justify-between pb-4 border-b border-black/20">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    EXHIBITIONS & PUBLICATIONS
                  </span>
                  <h2 className="mt-1 text-[28px] font-normal tracking-[-0.02em]">
                    Journal ({journalEntries.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetJournalForm}
                  className="inline-flex items-center gap-1.5 border border-black px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW ENTRY</span>
                </button>
              </div>

              <div className="space-y-3">
                {journalEntries.map((entry) => {
                  const isConfirming =
                    confirmDeleteTarget?.type === 'journal' &&
                    confirmDeleteTarget.id === entry.id;
                  const isDeleting = deletingKey === `journal:${entry.id}`;

                  return (
                    <div
                      key={entry.id}
                      className={`border p-4 flex items-center gap-4 ${
                        editingJournalId === entry.id
                          ? 'border-black bg-[#fafafa]'
                          : 'border-black/20 bg-white'
                      }`}
                    >
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className="w-16 h-16 object-cover border border-black/15 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#666666]">
                          {entry.category} · {entry.date}
                        </span>
                        <h3 className="text-[16px] font-normal text-black line-clamp-2">
                          {entry.title}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => startEditJournal(entry)}
                          className="border border-black/30 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase hover:bg-black hover:text-white cursor-pointer disabled:opacity-50"
                        >
                          EDIT
                        </button>
                        {isConfirming ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => void handleDeleteJournal(entry.id)}
                              className="border border-red-700 bg-red-700 text-white px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase hover:bg-red-800 cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? '...' : 'OK'}
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteTarget(null)}
                              className="border border-black/25 px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase text-black hover:border-black cursor-pointer disabled:opacity-50"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDeleteTarget({
                                type: 'journal',
                                id: entry.id,
                              })
                            }
                            className="border border-black/20 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                          >
                            DEL
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Journal Form */}
            <form
              ref={journalFormRef}
              onSubmit={handleSaveJournal}
              className="lg:col-span-7 border border-black/20 p-6 sm:p-8 space-y-6 bg-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/15">
                <h3 className="text-[22px] font-normal">
                  {editingJournalId
                    ? `Edit Journal Entry`
                    : 'Publish New Journal Entry'}
                </h3>
                {editingJournalId && (
                  <button
                    type="button"
                    onClick={resetJournalForm}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase underline cursor-pointer"
                  >
                    CANCEL EDIT
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={journalDraft.category}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        category: e.target.value as JournalEntry['category'],
                      }))
                    }
                    className="w-full bg-transparent border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  >
                    <option value="EXHIBITION">EXHIBITION</option>
                    <option value="PUBLICATION">PUBLICATION</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    DATE OR VENUE TAG *
                  </label>
                  <input
                    type="text"
                    required
                    value={journalDraft.date}
                    onChange={(e) =>
                      setJournalDraft((d) => ({ ...d, date: e.target.value }))
                    }
                    placeholder="NOVEMBER 2026 · BRAGA"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  ARTICLE TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={journalDraft.title}
                  onChange={(e) =>
                    setJournalDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Exhibition or Publication Title"
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  LEAD SUBTITLE *
                </label>
                <textarea
                  rows={2}
                  required
                  value={journalDraft.subtitle}
                  onChange={(e) =>
                    setJournalDraft((d) => ({ ...d, subtitle: e.target.value }))
                  }
                  placeholder="Short editorial summary..."
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                />
              </div>

              <ImageField
                label="COVER PHOTOGRAPH *"
                value={journalDraft.image}
                onChange={(url) =>
                  setJournalDraft((d) => ({ ...d, image: url }))
                }
                onUploadFile={handleUploadImage}
                cloudinaryConfigured={cloudinaryConfigured}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CREDIT LABEL
                  </label>
                  <input
                    type="text"
                    value={journalDraft.creditLabel}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        creditLabel: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[13px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    CREDIT VALUE
                  </label>
                  <input
                    type="text"
                    value={journalDraft.creditValue}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        creditValue: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[13px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    SECONDARY LABEL
                  </label>
                  <input
                    type="text"
                    value={journalDraft.secondaryLabel}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        secondaryLabel: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[13px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    SECONDARY VALUE
                  </label>
                  <input
                    type="text"
                    value={journalDraft.secondaryValue}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        secondaryValue: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[13px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                  INTRO PARAGRAPHS (SEPARATE PARAGRAPHS WITH BLANK LINE)
                </label>
                <textarea
                  rows={4}
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="Opening editorial text..."
                  className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    LARGE HEADING
                  </label>
                  <input
                    type="text"
                    value={journalDraft.largeHeading}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        largeHeading: e.target.value,
                      }))
                    }
                    placeholder="Spatial grammar and material"
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    LARGE HEADING BODY
                  </label>
                  <textarea
                    rows={3}
                    value={journalDraft.largeHeadingText}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        largeHeadingText: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    SUB HEADING
                  </label>
                  <input
                    type="text"
                    value={journalDraft.subHeading}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        subHeading: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    SUB HEADING BODY
                  </label>
                  <textarea
                    rows={2}
                    value={journalDraft.subHeadingText}
                    onChange={(e) =>
                      setJournalDraft((d) => ({
                        ...d,
                        subHeadingText: e.target.value,
                      }))
                    }
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.12em] uppercase text-[#666666] mb-1">
                    ARCHIVE SUMMARY NOTES (ONE PER LINE)
                  </label>
                  <textarea
                    rows={2}
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    className="w-full border-b border-black/25 focus:border-black py-2 text-[14px] focus:outline-none resize-y"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={journalDraft.featured}
                  onChange={(e) =>
                    setJournalDraft((d) => ({
                      ...d,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-black"
                />
                <span>SHOW IN JOURNAL SECTION</span>
              </label>

              <button
                type="submit"
                disabled={journalSaving}
                className="w-full border border-black bg-black text-white py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                {journalSaving
                  ? 'SAVING...'
                  : editingJournalId
                    ? 'SAVE JOURNAL ENTRY'
                    : 'PUBLISH JOURNAL ENTRY'}
              </button>
            </form>
          </section>
        )}

        {/* ================= TAB 6: CLOUD SYNC & MIGRATION ================= */}
        {activeTab === 'sync' && (
          <section className="space-y-8">
            <div className="pb-5 border-b border-black/20 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                  TURSO CLOUD + CLOUDINARY SYNCHRONIZATION
                </span>
                <h2 className="mt-1 text-[30px] font-normal tracking-[-0.02em]">
                  Cloud Sync &amp; Migration
                </h2>
              </div>

              <button
                type="button"
                onClick={() => void fetchAdminStatusAndEnquiries()}
                className="inline-flex items-center gap-2 border border-black/25 px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>REFRESH STATUS</span>
              </button>
            </div>

            {/* Prerequisites Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-black/20 p-6 bg-white space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    <Database className="w-4 h-4 text-black" strokeWidth={1.5} />
                    <span>TURSO CLOUD DATABASE</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase border ${
                      tursoCloud
                        ? 'bg-black text-white border-black'
                        : 'bg-[#fafafa] text-[#595959] border-black/25'
                    }`}
                  >
                    {tursoCloud ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.6] text-[#404040]">
                  {tursoCloud
                    ? 'Turso libSQL Cloud connection active. All settings, categories, artworks, journal entries, and enquiries persist remotely.'
                    : 'Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN configured in environment variables.'}
                </p>
              </div>

              <div className="border border-black/20 p-6 bg-white space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    <CloudUpload className="w-4 h-4 text-black" strokeWidth={1.5} />
                    <span>CLOUDINARY STORAGE</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase border ${
                      cloudinaryConfigured
                        ? 'bg-black text-white border-black'
                        : 'bg-[#fafafa] text-[#595959] border-black/25'
                    }`}
                  >
                    {cloudinaryConfigured ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.6] text-[#404040]">
                  {cloudinaryConfigured
                    ? 'Cloudinary signed upload and migration pipeline ready. All studio photographs are hosted on Cloudinary CDN.'
                    : 'Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET configured in environment variables.'}
                </p>
              </div>
            </div>

            {/* Sync Telemetry & Progress */}
            <div className="border border-black/20 p-6 sm:p-8 bg-white space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#666666]">
                    DATABASE &amp; MEDIA PARITY
                  </span>
                  <h3 className="mt-1 text-[22px] font-normal tracking-[-0.015em]">
                    {syncStats.fullySynchronized
                      ? '100% Synchronized with Turso & Cloudinary'
                      : `${syncStats.syncedPercent}% Synchronized`}
                  </h3>
                </div>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase tabular-nums text-black">
                  {syncStats.cloudinaryImages} / {syncStats.totalImages} IMAGES IN CLOUDINARY
                </span>
              </div>

              <div className="w-full h-2 bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${syncStats.syncedPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-black/10">
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-[#666666]">
                    REMAINING LOCAL
                  </span>
                  <span className="mt-1 block font-mono text-[18px] tabular-nums text-black">
                    {syncStats.remainingLocalAssets}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-[#666666]">
                    SITE IMAGES
                  </span>
                  <span className="mt-1 block font-mono text-[18px] tabular-nums text-black">
                    {adminStorage.counts.siteImages}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-[#666666]">
                    CATEGORIES / WORKS
                  </span>
                  <span className="mt-1 block font-mono text-[18px] tabular-nums text-black">
                    {categories.length} / {projects.length}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-[#666666]">
                    JOURNAL ENTRIES
                  </span>
                  <span className="mt-1 block font-mono text-[18px] tabular-nums text-black">
                    {journalEntries.length}
                  </span>
                </div>
              </div>

              {!tursoCloud || !cloudinaryConfigured ? (
                <div className="border border-black/20 bg-[#fafafa] px-4 py-3.5 font-mono text-[11px] tracking-[0.06em] uppercase text-[#404040]">
                  MIGRATION LOCKED: CONNECT BOTH TURSO CLOUD AND CLOUDINARY ENVIRONMENT VARIABLES TO ENABLE ONE-CLICK CLOUD MIGRATION.
                </div>
              ) : syncStats.fullySynchronized ? (
                <div className="border border-black bg-black text-white px-4 py-3.5 font-mono text-[11px] tracking-[0.08em] uppercase flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span>
                    100% SYNCHRONIZED — ALL ASSETS ARE ON CLOUDINARY AND ALL TABLES ARE UP TO DATE IN TURSO CLOUD.
                  </span>
                </div>
              ) : null}

              {lastMigrationSummary && (
                <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-[#262626] border-l-2 border-black pl-3">
                  {lastMigrationSummary}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!canMigrate}
                  onClick={() => void handleMigrateToCloud()}
                  className="w-full inline-flex items-center justify-center gap-2.5 border border-black bg-black text-white py-4 px-6 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-black/85 transition-colors cursor-pointer disabled:bg-black/15 disabled:border-black/20 disabled:text-black/45 disabled:cursor-not-allowed"
                >
                  <CloudUpload className="w-4 h-4" strokeWidth={1.5} />
                  <span>
                    {migrating
                      ? 'MIGRATING IMAGES TO CLOUDINARY & SYNCING TURSO...'
                      : syncStats.fullySynchronized
                        ? 'RE-SYNC ALL CONTENT TO TURSO & CLOUDINARY'
                        : 'MIGRATE ALL CONTENT TO TURSO & CLOUDINARY'}
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}
        </main>
      </div>
    </div>
  );
}
