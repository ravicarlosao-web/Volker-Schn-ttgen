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

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

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
        'Admin login is disabled because SESSION_SECRET is not configured in this environment.',
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
        'Admin login is disabled because ADMIN_PASSCODE is not configured.',
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
        'Admin login is disabled because neither ADMIN_PASSCODE nor a persistent database is configured.',
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

export function verifyEnvPasscode(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSCODE?.trim();
  if (!expected) return false;
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
  exp: number;
}

export function createAdminToken(): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET_MISSING');
  }

  const payload: AdminTokenPayload = {
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  const secret = getSessionSecret();
  if (!secret) return false;

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
    return (
      parsed.role === 'admin' &&
      typeof parsed.exp === 'number' &&
      parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

function getClientIpHash(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]?.trim()
        : undefined;
  const ip = rawIp || req.socket.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function checkLoginRateLimit(req: Request): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
  store: 'database' | 'memory';
}> {
  const ipHash = getClientIpHash(req);
  const now = Date.now();

  if (isPersistenceEnabled()) {
    try {
      const record = await getDbLoginAttempt(ipHash);
      if (record && now < record.resetAt && record.attempts >= MAX_LOGIN_ATTEMPTS) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((record.resetAt - now) / 1000),
          ),
          store: 'database',
        };
      }
      return { allowed: true, retryAfterSeconds: 0, store: 'database' };
    } catch {
      // Fall back cleanly to in-memory counter if DB check fails transiently
    }
  }

  const mem = memoryLoginAttempts.get(ipHash);
  if (mem) {
    if (now >= mem.resetAt) {
      memoryLoginAttempts.delete(ipHash);
    } else if (mem.attempts >= MAX_LOGIN_ATTEMPTS) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((mem.resetAt - now) / 1000)),
        store: 'memory',
      };
    }
  }

  return { allowed: true, retryAfterSeconds: 0, store: 'memory' };
}

export async function recordFailedLoginAttempt(req: Request): Promise<void> {
  const ipHash = getClientIpHash(req);
  const now = Date.now();

  if (isPersistenceEnabled()) {
    try {
      const current = await getDbLoginAttempt(ipHash);
      const nextAttempts =
        current && now < current.resetAt ? current.attempts + 1 : 1;
      const nextReset =
        current && now < current.resetAt
          ? current.resetAt
          : now + LOGIN_WINDOW_MS;
      await saveDbLoginAttempt(ipHash, nextAttempts, nextReset);
      return;
    } catch {
      // Fall back to memory map below
    }
  }

  const current = memoryLoginAttempts.get(ipHash);
  if (current && now < current.resetAt) {
    memoryLoginAttempts.set(ipHash, {
      attempts: current.attempts + 1,
      resetAt: current.resetAt,
    });
  } else {
    memoryLoginAttempts.set(ipHash, {
      attempts: 1,
      resetAt: now + LOGIN_WINDOW_MS,
    });
  }
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

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!getSessionSecret()) {
    res.status(503).json({
      error: 'Admin authentication is disabled: SESSION_SECRET is not configured.',
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
    return;
  }

  next();
}
