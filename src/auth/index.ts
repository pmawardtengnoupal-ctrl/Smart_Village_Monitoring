'use client';

export async function stampRoleCookie(): Promise<void> {
  const res = await fetch('/api/auth/stamp-role', { method: 'POST' });
  if (!res.ok) {
    // non-fatal: we’ll still let the user in as PUBLIC
    console.warn('stamp-role failed', await res.text());
  }
}
