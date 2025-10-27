'use client';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    hcaptcha?: {
      render: (el: HTMLElement, opts: any) => string;
      reset?: (id: string) => void;
      getResponse?: (id: string) => string;
    };
  }
}

type Props = { onVerify: (token?: string) => void; className?: string };

export default function Captcha({ onVerify, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!sitekey) {
      onVerify('dev-no-captcha'); // graceful local fallback
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (ref.current && window.hcaptcha && !widgetId.current) {
        widgetId.current = window.hcaptcha.render(ref.current, {
          sitekey,
          theme: 'light',
          callback: (token: string) => onVerify(token),
          'error-callback': () => onVerify(undefined),
          'expired-callback': () => onVerify(undefined),
        });
      }
    };
    document.body.appendChild(script);
    return () => { /* script can remain cached */ };
  }, [onVerify, sitekey]);

  return (
    <div className={className}>
      {!sitekey && (
        <div className="mb-2 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
          CAPTCHA disabled (no NEXT_PUBLIC_HCAPTCHA_SITE_KEY). Dev only.
        </div>
      )}
      <div ref={ref} className="scale-[0.98] origin-left transition-all" />
    </div>
  );
}
