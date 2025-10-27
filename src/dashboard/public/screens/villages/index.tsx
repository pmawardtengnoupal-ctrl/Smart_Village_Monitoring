'use client';
import React, { useEffect, useState } from 'react';
import { PublicData } from '@data/views';
import Link from 'next/link';

export default function VillagesList() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const data = await PublicData.listVillages(q, 50);
    setRows(data);
    setLoading(false);
  }

  useEffect(()=>{ search(); /* initial */ },[]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Find my village</div>
        <div className="mt-2 flex gap-2">
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search by village name"
            className="w-full rounded border px-3 py-2"
          />
          <button onClick={search} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Village</th>
              <th className="px-3 py-2 text-left">Block</th>
              <th className="px-3 py-2 text-left">District</th>
              <th className="px-3 py-2 text-left">Population</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.village_code} className="odd:bg-slate-50/50">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.block_code}</td>
                <td className="px-3 py-2">{r.district_code}</td>
                <td className="px-3 py-2">{r.population?.toLocaleString?.() ?? '—'}</td>
                <td className="px-3 py-2">
                  <Link className="text-emerald-700 underline" href={`/public/village/${r.village_code}`}>Open</Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={5}>No villages found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
