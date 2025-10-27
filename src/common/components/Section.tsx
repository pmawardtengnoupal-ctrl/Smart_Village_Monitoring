'use client';
import React from 'react';

export default function Section({ title, children }:{ title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="text-lg font-semibold">{title}</div>
      {children}
    </section>
  );
}
