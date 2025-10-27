'use client';
import React from 'react';

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx('min-h-screen bg-slate-50')}>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
