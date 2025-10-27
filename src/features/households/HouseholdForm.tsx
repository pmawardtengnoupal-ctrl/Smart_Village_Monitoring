// src/features/households/HouseholdForm.tsx
'use client';
import React from 'react';
import { supabase } from '@data/supabaseClient';

export default function HouseholdForm() {
  const [village_code, setVillage] = React.useState('');
  const [local_hh_no, setLocal] = React.useState('');
  const [head_name, setHead] = React.useState('');
  const [phone, setPhone] = React.useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.rpc('upsert_households', {
      p: {
        village_code,
        local_hh_no,
        head_name,
        phone
      }
    });
    if (error) alert(error.message);
    else alert('Saved');
  }

  return (
    <form onSubmit={save} className="rounded border bg-white p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={village_code} onChange={e=>setVillage(e.target.value)} placeholder="Village code" className="rounded border px-3 py-2" />
        <input value={local_hh_no} onChange={e=>setLocal(e.target.value)} placeholder="Local HH No (optional)" className="rounded border px-3 py-2" />
        <input value={head_name} onChange={e=>setHead(e.target.value)} placeholder="Head name" className="rounded border px-3 py-2" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="rounded border px-3 py-2" />
      </div>
      <button className="rounded bg-emerald-600 px-4 py-2 text-white">Save household</button>
    </form>
  );
}
