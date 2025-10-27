'use client';
import React, { useEffect, useState } from 'react';
import { PublicData } from '@data/views';

export default function SchemeDetailScreen({ slug }: { slug?: string[] }) {
  // Expect /public/scheme/[code]
  const code = slug?.[1] || '';
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    (async ()=> setItem(await PublicData.schemeDetail(code)))();
  }, [code]);

  if (!code) return <div className="rounded-xl border bg-white p-4">Invalid scheme code.</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">{item?.name || code}</div>
        <div className="mt-1 text-sm text-slate-600">{item?.description_short || '—'}</div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Eligibility (auto-checked by AI later)</div>
        <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">{JSON.stringify(item?.eligibility ?? {}, null, 2)}</pre>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Documents required</div>
        <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">{JSON.stringify(item?.documents_required ?? {}, null, 2)}</pre>
      </div>
    </div>
  );
}
