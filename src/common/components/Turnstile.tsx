'use client';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: {
        sitekey: string;
        theme?: 'auto' | 'dark' | 'light';
        callback?: (token: string) => void;
      }) => void;
    };
  }
}

export default function Turnstile({ onVerify }: { onVerify?: (token: string) => void }) {
  const elRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  useEffect(() => {
    if (!siteKey) return;
    const scriptId = 'cf-turnstile';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      document.head.appendChild(s);
    }

    const int = setInterval(() => {
      if (window.turnstile && elRef.current) {
        window.turnstile.render(elRef.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token) => onVerify?.(token),
        });
        clearInterval(int);
      }
    }, 100);

    return () => clearInterval(int);
  }, [onVerify, siteKey]);

  if (!siteKey) {
    // Fail-open for local dev if no key is provided.
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
        CAPTCHA disabled (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY). Local dev only.
      </div>
    );
  }

  return <div ref={elRef} className="my-1" />;
}
