const DEFAULT_ADMIN_PATH = '/atelier-vs-7k9m2x';

export function normalizeAdminPath(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return DEFAULT_ADMIN_PATH;
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const cleaned = withSlash.replace(/\/+$/, '');
  if (
    !cleaned ||
    cleaned === '/' ||
    cleaned === '/admin' ||
    cleaned.startsWith('/api') ||
    cleaned.startsWith('/assets')
  ) {
    return DEFAULT_ADMIN_PATH;
  }
  return cleaned;
}

export const ADMIN_ROUTE_PATH = normalizeAdminPath(
  import.meta.env.VITE_ADMIN_PATH,
);

export function isAdminPathname(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return (
    normalized === ADMIN_ROUTE_PATH ||
    normalized.startsWith(`${ADMIN_ROUTE_PATH}/`)
  );
}
