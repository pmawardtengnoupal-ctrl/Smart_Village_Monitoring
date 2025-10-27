// src/dashboard/public/screens/home/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Section from '@common/components/Section';
import KPICard from '@common/components/KPICard';
import AnimatedNumber from '@common/components/AnimatedNumber';
import Link from 'next/link';
import { PublicData, type BadgeKPI, type SchemeListItem } from '@data/views';

export default function Home() {
  const [kpi, setKpi] = useState<BadgeKPI>({ villages: 0, completed: 0, inprog: 0, pipeline: 0, avgGap: 0 });
  const [schemes, setSchemes] = useState<SchemeListItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const b = await PublicData.badges();
      const s = await PublicData.newPublicSchemes(6);
      setKpi(b);
      setSchemes(s);
      setReady(true);
    })();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="relative">
          <h1 className="text-2xl font-semibold tracking-tight">Monitor every village. Close every gap.</h1>
          <p className="mt-1 text-slate-600">Transparent coverage of schemes, infrastructure & grievances — district wide.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/public/villages" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Find my village</Link>
            <Link href="/public/grievances/new" className="rounded border px-4 py-2 hover:bg-slate-50">Submit grievance</Link>
            <Link href="/public/ai" className="rounded border px-4 py-2 hover:bg-slate-50">Ask AI</Link>
          </div>
        </div>
      </section>

      <Section title="Snapshot">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <KPICard label="Villages" value={ready ? <AnimatedNumber value={kpi.villages} /> : '—'} />
          <KPICard label="Schemes completed" value={ready ? <AnimatedNumber value={kpi.completed} /> : '—'} />
          <KPICard label="In progress" value={ready ? <AnimatedNumber value={kpi.inprog} /> : '—'} />
          <KPICard label="Pipeline" value={ready ? <AnimatedNumber value={kpi.pipeline} /> : '—'} />
          <KPICard label="Avg gap score" value={ready ? <AnimatedNumber value={kpi.avgGap} /> : '—'} />
        </div>
      </Section>

      <Section title="Coverage map">
        <div className="flex h-80 items-center justify-center rounded-lg border bg-slate-100 text-slate-500">
          Map placeholder (hook MapLibre/Leaflet in Phase-2)
        </div>
      </Section>

      <Section title="New & updated schemes">
        <div className="grid gap-3 md:grid-cols-3">
          {schemes.map((s) => (
            <div key={s.code} className="glass rounded-xl border p-4 shadow-sm transition-shadow hover:shadow">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="mt-1 text-xs text-slate-500">{s.updated_at ? 'Updated recently' : '—'}</div>
              <div className="mt-3">
                <Link href={`/public/scheme/${s.code}`} className="text-emerald-700 underline">See eligibility</Link>
              </div>
            </div>
          ))}
          {!schemes.length && [1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-white p-4">Scheme #{i}</div>
          ))}
        </div>
      </Section>

      {/* keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-8px) }
          100% { transform: translateY(0px) }
        }
      `}</style>
    </div>
  );
}
