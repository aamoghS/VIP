import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'vip_session';

function generateSessionId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `sess_${id}`;
}

/**
 * Get the session ID from cookies (server-side, for API routes).
 * Creates a new session if one doesn't exist.
 */
export async function getOrCreateSessionId(): Promise<{ sessionId: string; isNew: boolean }> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME);

  if (existing?.value) {
    return { sessionId: existing.value, isNew: false };
  }

  const newId = generateSessionId();
  cookieStore.set(SESSION_COOKIE_NAME, newId, {
    httpOnly: false, // Allow client-side reading for display purposes
    secure: false,   // Allow in dev (HTTP)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { sessionId: newId, isNew: true };
}

/**
 * Read the session ID from request headers (for use in API routes
 * when you don't want to create a new session).
 */
export function readSessionIdFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Client-side utility to read the session ID from document.cookie.
 */
export function getClientSessionId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Client-side utility to set a session ID cookie.
 */
export function setClientSessionId(sessionId: string): void {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${maxAge}; samesite=lax`;
}
