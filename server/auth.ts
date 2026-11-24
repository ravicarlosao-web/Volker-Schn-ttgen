import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import {
  clearDbLoginAttempt,
  getAdminCredentialHash,
  getDbLoginAttempt,
  isPersistenceEnabled,
  isServerlessOrProd,
  saveDbLoginAttempt,
} from './db.ts';

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS_PER_IP = 5;
const MAX_LOGIN_ATTEMPTS_GLOBAL = 20;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_RATE_KEY = crypto
  .createHash('sha256')
  .update('__global_login_rate_limit__')
  .digest('hex');

let devEphemeralSecret: string | null = null;
const memoryLoginAttempts = new Map<
  string,
  { attempts: number; resetAt: number }
>();

export function isSessionSecretConfigured(): boolean {
  return Boolean(process.env.SESSION_SECRET?.trim());
}

export function getSessionSecret(): string | null {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured) return configured;

  // Never fall back to an in-memory ephemeral secret in production or Vercel serverless.
  if (isServerlessOrProd()) {
    return null;
  }

  if (!devEphemeralSecret) {
    devEphemeralSecret = crypto.randomBytes(32).toString('hex');
  }
  return devEphemeralSecret;
}

export function isEnvPasscodeConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSCODE?.trim());
}

export interface AdminAuthState {
  adminEnabled: boolean;
  disabledReason: string | null;
  sessionSecretConfigured: boolean;
  envPasscodeConfigured: boolean;
  needsSetup: boolean;
  setupAllowed: boolean;
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  const sessionSecretConfigured = isSessionSecretConfigured();
  const envPasscodeConfigured = isEnvPasscodeConfigured();
  const prod = isServerlessOrProd();
  const persistence = isPersistenceEnabled();

  if (prod && !sessionSecretConfigured) {
    return {
      adminEnabled: false,
      disabledReason:
        'Admin console access is currently disabled in this environment.',
      sessionSecretConfigured,
      envPasscodeConfigured,
      needsSetup: false,
      setupAllowed: false,
    };
  }

  const storedHash =
    !envPasscodeConfigured && persistence
      ? await getAdminCredentialHash()
      : null;

  // Setup is strictly disabled in production/Vercel and whenever ADMIN_PASSCODE is set.
  const setupAllowed =
    !prod && !envPasscodeConfigured && persistence && storedHash === null;

  if (prod && !envPasscodeConfigured && storedHash === null) {
    return {
      adminEnabled: false,
      disabledReason:
        'Admin console access is currently disabled in this environment.',
      sessionSecretConfigured,
      envPasscodeConfigured,
      needsSetup: false,
      setupAllowed: false,
    };
  }

  if (!envPasscodeConfigured && !persistence) {
    return {
      adminEnabled: false,
      disabledReason:
        'Admin console access is currently disabled in this environment.',
      sessionSecretConfigured,
      envPasscodeConfigured,
      needsSetup: false,
      setupAllowed: false,
    };
  }

  return {
    adminEnabled: true,
    disabledReason: null,
    sessionSecretConfigured,
    envPasscodeConfigured,
    needsSetup: setupAllowed,
    setupAllowed,
  };
}

/**
 * Computes a keyed fingerprint of the active admin credential so that rotating
 * ADMIN_PASSCODE or changing the stored credential invalidates all existing sessions.
 */
async function getCredentialFingerprint(secret: string): Promise<string> {
  const envPasscode = process.env.ADMIN_PASSCODE?.trim();
  let material = '';
  if (envPasscode) {
    material = `env:${envPasscode}`;
  } else if (isPersistenceEnabled()) {
    const dbHash = await getAdminCredentialHash();
    material = dbHash ? `db:${dbHash}` : 'none';
  } else {
    material = 'none';
  }
  return crypto
    .createHmac('sha256', secret)
    .update(material)
    .digest('hex')
    .slice(0, 16);
}

export function verifyEnvPasscode(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSCODE?.trim();
  if (!expected || candidate.length > 256) return false;
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  if (password.length > 256) return false;
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, hexHash] = parts;
  if (!salt || !hexHash) return false;
  try {
    const expectedBuf = Buffer.from(hexHash, 'hex');
    const actualBuf = crypto.scryptSync(password, salt, 64);
    if (expectedBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

interface AdminTokenPayload {
  role: 'admin';
  jti: string;
  ver: string;
  exp: number;
}

export async function createAdminToken(): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET_MISSING');
  }

  const ver = await getCredentialFingerprint(secret);
  const payload: AdminTokenPayload = {
    role: 'admin',
    jti: crypto.randomBytes(12).toString('hex'),
    ver,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || token.length > 512) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return false;

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as AdminTokenPayload;
    if (
      parsed.role !== 'admin' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Date.now() ||
      typeof parsed.ver !== 'string'
    ) {
      return false;
    }

    const expectedVer = await getCredentialFingerprint(secret);
    const verBuf = Buffer.from(parsed.ver);
    const expectedVerBuf = Buffer.from(expectedVer);
    if (verBuf.length !== expectedVerBuf.length) return false;
    return crypto.timingSafeEqual(verBuf, expectedVerBuf);
  } catch {
    return false;
  }
}

function getClientIpHash(req: Request): string {
  const realIp = req.headers['x-real-ip'];
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp =
    (typeof realIp === 'string' && realIp.trim()) ||
    req.ip ||
    (typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]?.trim()
        : undefined) ||
    req.socket.remoteAddress ||
    'unknown';
  return crypto.createHash('sha256').update(rawIp).digest('hex');
}

async function readAttemptRecord(
  keyHash: string,
): Promise<{ attempts: number; resetAt: number } | null> {
  if (isPersistenceEnabled()) {
    try {
      return await getDbLoginAttempt(keyHash);
    } catch {
      // Fall back to in-memory counter if DB read fails transiently
    }
  }
  return memoryLoginAttempts.get(keyHash) ?? null;
}

async function incrementAttemptRecord(keyHash: string): Promise<void> {
  const now = Date.now();
  if (isPersistenceEnabled()) {
    try {
      const current = await getDbLoginAttempt(keyHash);
      const nextAttempts =
        current && now < current.resetAt ? current.attempts + 1 : 1;
      const nextReset =
        current && now < current.resetAt
          ? current.resetAt
          : now + LOGIN_WINDOW_MS;
      await saveDbLoginAttempt(keyHash, nextAttempts, nextReset);
      return;
    } catch {
      // Fall back to memory map below
    }
  }

  const current = memoryLoginAttempts.get(keyHash);
  if (current && now < current.resetAt) {
    memoryLoginAttempts.set(keyHash, {
      attempts: current.attempts + 1,
      resetAt: current.resetAt,
    });
  } else {
    memoryLoginAttempts.set(keyHash, {
      attempts: 1,
      resetAt: now + LOGIN_WINDOW_MS,
    });
  }
}

export async function checkLoginRateLimit(req: Request): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
  store: 'database' | 'memory';
}> {
  const ipHash = getClientIpHash(req);
  const now = Date.now();
  const store = isPersistenceEnabled() ? 'database' : 'memory';

  const [ipRec, globalRec] = await Promise.all([
    readAttemptRecord(ipHash),
    readAttemptRecord(GLOBAL_RATE_KEY),
  ]);

  if (ipRec && now < ipRec.resetAt && ipRec.attempts >= MAX_LOGIN_ATTEMPTS_PER_IP) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((ipRec.resetAt - now) / 1000)),
      store,
    };
  }

  if (
    globalRec &&
    now < globalRec.resetAt &&
    globalRec.attempts >= MAX_LOGIN_ATTEMPTS_GLOBAL
  ) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((globalRec.resetAt - now) / 1000),
      ),
      store,
    };
  }

  if (ipRec && now >= ipRec.resetAt) memoryLoginAttempts.delete(ipHash);
  if (globalRec && now >= globalRec.resetAt) {
    memoryLoginAttempts.delete(GLOBAL_RATE_KEY);
  }

  return { allowed: true, retryAfterSeconds: 0, store };
}

export async function recordFailedLoginAttempt(req: Request): Promise<void> {
  const ipHash = getClientIpHash(req);
  await Promise.all([
    incrementAttemptRecord(ipHash),
    incrementAttemptRecord(GLOBAL_RATE_KEY),
  ]);
}

export async function clearLoginRateLimit(req: Request): Promise<void> {
  const ipHash = getClientIpHash(req);
  memoryLoginAttempts.delete(ipHash);
  if (isPersistenceEnabled()) {
    try {
      await clearDbLoginAttempt(ipHash);
    } catch {
      // Ignore cleanup error
    }
  }
}

/**
 * Defense-in-depth origin check for browser-originated state-changing requests.
 */
export function verifySameOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const origin = req.headers.origin;
  if (!origin) {
    next();
    return;
  }

  const forwardedHost =
    typeof req.headers['x-forwarded-host'] === 'string'
      ? req.headers['x-forwarded-host']
      : undefined;
  const expectedHost = forwardedHost || req.headers.host;

  try {
    const parsedOrigin = new URL(origin);
    if (expectedHost && parsedOrigin.host === expectedHost) {
      next();
      return;
    }

    const appUrl = process.env.APP_URL?.trim();
    if (appUrl && parsedOrigin.host === new URL(appUrl).host) {
      next();
      return;
    }
  } catch {
    // Reject malformed Origin below
  }

  res.status(403).json({ error: 'Cross-origin request rejected.' });
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!getSessionSecret()) {
      res.status(503).json({
        error: 'Admin console is disabled in this environment.',
      });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const token = authHeader.slice(7).trim();
    const valid = await verifyAdminToken(token);
    if (!valid) {
      res.status(401).json({ error: 'Invalid or expired admin session.' });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
  }
}
