const SESSION_COOKIE_NAME = 'session_token';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24; // 24 hours

export type UserRole = 'admin' | 'user';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set in production');
    }

    return 'dev-only-session-secret-change-me';
  }

  return secret;
}

function utf8ToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToUtf8(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toBase64Url(value: string) {
  return utf8ToBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return base64ToUtf8(padded);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function sign(value: string) {
  const secret = getSessionSecret();
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(user: Omit<SessionUser, 'exp'>) {
  const payload: SessionUser = {
    ...user,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  const [encodedPayload, providedSignature] = token.split('.');

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload);
  if (providedSignature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionUser;

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    if (payload.role !== 'admin' && payload.role !== 'user') {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function parseCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const items = cookieHeader.split(';').map((item) => item.trim());
  const match = items.find((item) => item.startsWith(`${cookieName}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split('=').slice(1).join('='));
}

export async function getSessionFromRequest(request: Request) {
  const token = parseCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function getSessionCookieConfig(token: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  };
}

export function clearSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

export { SESSION_COOKIE_NAME };
