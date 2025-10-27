'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Turnstile from '@common/components/Turnstile';
import {
  signInWithEmail,
  signUpWithEmail,
  requestResetLink,
  setNewPassword,
  landingForRole,
  getProfile,
} from '@auth/services/session';

type Tab = 'login' | 'signup' | 'forgot';

function PasswordField({
  value, onChange, placeholder, name,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; name?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        className="w-full rounded border px-3 py-2 pr-10"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

function strengthLabel(score: number) {
  if (score >= 4) return 'Strong';
  if (score === 3) return 'Good';
  if (score === 2) return 'Weak';
  return 'Very weak';
}
function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function AuthTabs({ onSuccess }: { onSuccess?: () => void }) {
  const [tab, setTab] = useState<Tab>('login');

  // shared
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [ok, setOk] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  // login
  const [loginPw, setLoginPw] = useState('');

  // signup
  const [fullName, setFullName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const pwScore = useMemo(() => scorePassword(pw1), [pw1]);

  // forgot / reset
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPw1, setNewPw1] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [resend, setResend] = useState(0);
  const resendRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!resend) return;
    resendRef.current && clearInterval(resendRef.current);
    resendRef.current = setInterval(() => {
      setResend((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => { if (resendRef.current) clearInterval(resendRef.current); };
  }, [resend]);

  function resetMessages() {
    setError(undefined); setOk(undefined);
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      await signInWithEmail(email, loginPw, captcha);
      const p = await getProfile();
      onSuccess?.();
      window.location.href = landingForRole((p?.role as any) || 'PUBLIC');
    } catch (e: any) {
      setError(e.message || 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  async function doSignup(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (pw1 !== pw2) { setError('Passwords do not match'); return; }
    if (pwScore < 3) { setError('Password too weak (use 8+, 1 uppercase, 1 number, 1 special)'); return; }
    setBusy(true);
    try {
      await signUpWithEmail(email, pw1, fullName, captcha, deptCode || undefined);
      const p = await getProfile();
      onSuccess?.();
      window.location.href = landingForRole((p?.role as any) || 'PUBLIC');
    } catch (e: any) {
      setError(e.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  }

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      // We support BOTH: link-based resets (Supabase default) and OTP flow (optional).
      await requestResetLink(email); // sends email link
      setOk('Reset link sent to your email. You can also use OTP if enabled.');
      setOtpSent(true);
      setResend(30);
    } catch (e: any) {
      setError(e.message || 'Failed to send reset link');
    } finally {
      setBusy(false);
    }
  }

  async function applyNewPassword(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (newPw1 !== newPw2) { setError('Passwords do not match'); return; }
    if (scorePassword(newPw1) < 3) { setError('Password too weak'); return; }
    setBusy(true);
    try {
      // If you enable OTP resets server-side, pass the OTP; otherwise this does nothing and link flow is used.
      await setNewPassword(email, newPw1, otp || undefined);
      setOk('Password updated. You can sign in now.');
    } catch (e: any) {
      setError(e.message || 'Failed to set new password');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="inline-flex overflow-hidden rounded-lg border bg-slate-50 text-sm">
        <button onClick={() => setTab('login')} className={`px-3 py-1.5 ${tab === 'login' ? 'bg-white' : 'hover:bg-white/60'}`}>Sign in</button>
        <button onClick={() => setTab('signup')} className={`px-3 py-1.5 ${tab === 'signup' ? 'bg-white' : 'hover:bg-white/60'}`}>Create account</button>
        <button onClick={() => setTab('forgot')} className={`px-3 py-1.5 ${tab === 'forgot' ? 'bg-white' : 'hover:bg-white/60'}`}>Forgot</button>
      </div>

      {/* Body */}
      {tab === 'login' && (
        <form onSubmit={doLogin} className="space-y-3 animate-[fadeIn_.2s_ease-out]">
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Email (username)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <PasswordField value={loginPw} onChange={setLoginPw} placeholder="Password" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" /> Remember this device
            </label>
            <span className="text-xs text-slate-500">Lockout after 5 failed tries</span>
          </div>
          <Turnstile onVerify={setCaptcha} />
          {error && <div className="rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{error}</div>}
          <button disabled={busy} className="w-full rounded bg-emerald-600 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}

      {tab === 'signup' && (
        <form onSubmit={doSignup} className="space-y-3 animate-[fadeIn_.2s_ease-out]">
          <input className="w-full rounded border px-3 py-2" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Email (username)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField value={pw1} onChange={setPw1} placeholder="Password" name="new-password" />
          <PasswordField value={pw2} onChange={setPw2} placeholder="Confirm password" name="new-password" />
          {/* Strength meter */}
          <div className="text-xs">
            <div className="mb-1 text-slate-600">Password strength: <b>{strengthLabel(pwScore)}</b></div>
            <div className="h-1 w-full rounded bg-slate-200">
              <div className={`h-1 rounded ${pwScore >= 1 ? 'bg-red-400' : 'bg-transparent'}`} style={{ width: '25%' }} />
              <div className={`h-1 -mt-1 rounded ${pwScore >= 2 ? 'bg-yellow-400' : 'bg-transparent'}`} style={{ width: '50%' }} />
              <div className={`h-1 -mt-1 rounded ${pwScore >= 3 ? 'bg-emerald-400' : 'bg-transparent'}`} style={{ width: '75%' }} />
              <div className={`h-1 -mt-1 rounded ${pwScore >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} style={{ width: '100%' }} />
            </div>
            <div className="mt-1 text-slate-500">Use 8+, 1 uppercase, 1 number, 1 special.</div>
          </div>
          <input className="w-full rounded border px-3 py-2" placeholder="Department Code (optional)" value={deptCode} onChange={(e) => setDeptCode(e.target.value)} />
          <Turnstile onVerify={setCaptcha} />
          {error && <div className="rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{error}</div>}
          <button disabled={busy} className="w-full rounded bg-emerald-600 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
      )}

      {tab === 'forgot' && (
        <div className="space-y-4 animate-[fadeIn_.2s_ease-out]">
          <form onSubmit={sendReset} className="space-y-3">
            <input className="w-full rounded border px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button disabled={busy || resend > 0} className="w-full rounded bg-emerald-600 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">
              {resend > 0 ? `Resend in ${resend}s` : 'Send reset link'}
            </button>
          </form>

          <div className="text-xs text-slate-600">If OTP reset is enabled for your project, enter the code here:</div>
          <form onSubmit={applyNewPassword} className="space-y-3">
            <input className="w-full rounded border px-3 py-2" placeholder="6-digit OTP (optional)" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <PasswordField value={newPw1} onChange={setNewPw1} placeholder="New password" />
            <PasswordField value={newPw2} onChange={setNewPw2} placeholder="Confirm new password" />
            {ok && <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">{ok}</div>}
            {error && <div className="rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{error}</div>}
            <button disabled={busy} className="w-full rounded border border-emerald-600 py-2 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
              {busy ? 'Updating…' : 'Set new password'}
            </button>
          </form>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px) }
          to   { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
}
