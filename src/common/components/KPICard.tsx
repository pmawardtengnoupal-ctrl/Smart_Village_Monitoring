'use client';
import React from 'react';

export default function KPICard({ label, value }:{ label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
