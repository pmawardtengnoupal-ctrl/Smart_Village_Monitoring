'use client';
import React, { useEffect, useState } from 'react';
import { PublicData } from '@data/views';

export default function VillageScreen({ slug }: { slug?: string[] }) {
  // Expect /public/village/[code]
  const code = slug?.[1] || '';
  const [profile, setProfile] = useState<any>(null);
  const [coverage, setCoverage] = useState<any[]>([]);

  useEffect(() => {
    if (!code) return;
    (async ()=>{
      setProfile(await PublicData.villageProfile(code));
      setCoverage(await PublicData.schemeCoverageByVillage(code));
    })();
  }, [code]);

  if (!code) return <div className="rounded-xl border bg-white p-4">Invalid village code.</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">{profile?.name || code}</div>
        <div className="mt-1 text-sm text-slate-600">
          Block: {profile?.block_code || '—'} • District: {profile?.district_code || '—'} • Population: {profile?.population ?? '—'}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold">Scheme coverage</div>
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Scheme</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Beneficiaries</th>
                <th className="px-3 py-2 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((c,i)=>(
                <tr key={i} className="odd:bg-slate-50/50">
                  <td className="px-3 py-2">{c.scheme_code}</td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2">{c.beneficiaries_count ?? '—'}</td>
                  <td className="px-3 py-2">{c.last_update_at ? new Date(c.last_update_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {!coverage.length && <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">No records yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
