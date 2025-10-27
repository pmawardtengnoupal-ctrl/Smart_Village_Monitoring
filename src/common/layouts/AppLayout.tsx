// src/common/layouts/AppLayout.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Drawer from '@common/components/Drawer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/public/home" className="font-semibold">Smart Village</Link>
          <div className="flex items-center gap-3">
            <button onClick={()=>setOpen(true)} className="rounded border px-3 py-1.5 hover:bg-slate-50">Account</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>

      <Drawer open={open} onClose={()=>setOpen(false)} side="right">
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">Account</h3>
          <Link className="block text-emerald-700 hover:underline" href="/auth/login">Sign in</Link>
          <Link className="block text-emerald-700 hover:underline" href="/auth/signup">Create account</Link>
          <Link className="block text-emerald-700 hover:underline" href="/auth/forgot">Forgot password</Link>
        </div>
      </Drawer>
    </div>
  );
}
