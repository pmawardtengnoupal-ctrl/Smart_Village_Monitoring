'use client';

import React, { useState } from 'react';
import Captcha from '@common/components/Captcha';
import PasswordInput from '@common/components/PasswordInput';
import { requestResetLink, signInWithEmail, signUpWithEmail, landingForRole } from '@auth/services/session';
import type { Role } from '@auth/services/types';
import { useRouter } from 'next/navigation';
import type { Route } from 'next'; // <-- make router.push happy with typedRoutes

type Tab = 'login' | 'signup' | 'forgot';

export default function AuthModal({
  initialTab = 'login',
  onDone,
  standalone = false,
}: {
  initialTab?: Tab;
  onDone?: () => void;
  standalone?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [captcha, setCaptcha] = useState<string | undefined>();
  const [err, setErr] = useState<string | undefined>();
  const [ok, setOk] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined); setBusy(true);
    try {
      await signInWithEmail(email, password, captcha);
      const dest = landingForRole('PUBLIC' as Role) as Route; // <-- fix: cast to Route
      router.push(dest);
      onDone?.();
    } catch (e: any) {
      setErr(e.message ?? 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  async function doSignup(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined); setBusy(true);
    try {
      await signUpWithEmail(email, password, fullName, captcha, deptCode || undefined);
      const dest = landingForRole('PUBLIC' as Role) as Route; // <-- fix: cast to Route
      router.push(dest);
      onDone?.();
    } catch (e: any) {
      setErr(e.message ?? 'Sign up failed');
    } finally {
      setBusy(false);
    }
  }

  async function doForgot(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined); setOk(undefined); setBusy(true);
    try {
      await requestResetLink(email);
      setOk('Reset link sent to your email.');
    } catch (e: any) {
      setErr(e.message ?? 'Could not send reset link');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={standalone ? 'max-w-lg mx-auto' : ''}>
      {/* Tabs (simple “Facebook-style” segmented control) */}
      <div
        className="inline-flex rounded-xl border bg-slate-50 text-sm overflow-hidden shadow-sm"
        style={{ transition: 'transform .15s ease' }}
      >
        <button
          onClick={() => setTab('login')}
          className={'px-3 py-1.5 transition-colors ' + (tab === 'login' ? 'bg-white' : 'hover:bg-white/60')}
        >
          Sign in
        </button>
        <button
          onClick={() => setTab('signup')}
          className={'px-3 py-1.5 transition-colors ' + (tab === 'signup' ? 'bg-white' : 'hover:bg-white/60')}
        >
          Sign up
        </button>
        <button
          onClick={() => setTab('forgot')}
          className={'px-3 py-1.5 transition-colors ' + (tab === 'forgot' ? 'bg-white' : 'hover:bg-white/60')}
        >
          Forgot
        </button>
      </div>

      {/* Panels */}
      {tab === 'login' && (
        <form onSubmit={doLogin} className="mt-4 space-y-3 animate-[fadeIn_.22s_ease]">
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <PasswordInput value={password} onChange={setPassword} />
          <Captcha onVerify={setCaptcha} />
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button
            className="w-full py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.99] transition-transform disabled:opacity-60"
            disabled={busy}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}

      {tab === 'signup' && (
        <form onSubmit={doSignup} className="mt-4 space-y-3 animate-[fadeIn_.22s_ease]">
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <PasswordInput value={password} onChange={setPassword} />
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Department code (optional)"
            value={deptCode}
            onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
          />
          <Captcha onVerify={setCaptcha} />
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button
            className="w-full py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.99] transition-transform disabled:opacity-60"
            disabled={busy}
          >
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
      )}

      {tab === 'forgot' && (
        <form onSubmit={doForgot} className="mt-4 space-y-3 animate-[fadeIn_.22s_ease]">
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Captcha onVerify={setCaptcha} />
          {err && <p className="text-sm text-rose-600">{err}</p>}
          {ok && <p className="text-sm text-emerald-700">{ok}</p>}
          <button
            className="w-full py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.99] transition-transform disabled:opacity-60"
            disabled={busy}
          >
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      {/* micro animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
