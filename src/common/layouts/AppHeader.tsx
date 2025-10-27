'use client';

import React from 'react';
import { useAuthDrawer } from '@common/components/AuthDrawerContext';

export default function AppHeader() {
  const { openAuth } = useAuthDrawer();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-emerald-600" />
          <span className="font-semibold">Smart Village Monitoring</span>
        </div>

        <div className="flex items-center gap-2">
          {/* You can add role switcher, notifications, etc. here */}
          <button
            onClick={openAuth}
            className="rounded-full border px-3 py-1.5 text-sm hover:bg-slate-50 transition"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
