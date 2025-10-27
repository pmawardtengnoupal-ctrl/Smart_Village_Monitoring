'use client';
import React, { useState } from 'react';
import Captcha from '@common/components/Captcha';
import { supabase } from '@auth/services/session';

export default function GrievanceForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [details, setDetails] = useState('');
  const [captcha, setCaptcha] = useState<string|undefined>();
  const [msg, setMsg] = useState<string|undefined>();
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(undefined);
    if (!captcha) { setMsg('Please complete captcha.'); return; }
    setSaving(true);
    try{
      // For Phase-1 we write to staging_changes to go through validation later
      await supabase.from('staging_changes').insert({
        entity: 'grievances',
        payload_after: {
          public_name: name,
          public_contact: contact,
          village_code: village || null,
          category,
          details
        },
        source: 'PUBLIC_FORM'
      }).throwOnError();
      setMsg('Submitted! Your grievance has been recorded for review.');
      setName(''); setContact(''); setVillage(''); setCategory('GENERAL'); setDetails(''); setCaptcha(undefined);
    }catch(e:any){
      setMsg(e.message || 'Failed to submit.');
    }finally{
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Submit grievance</div>
        <div className="text-sm text-slate-600">We’ll route it to the right office.</div>
      </div>

      <form onSubmit={submit} className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="rounded border px-3 py-2" />
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Phone or email" className="rounded border px-3 py-2" />
          <input value={village} onChange={e=>setVillage(e.target.value)} placeholder="Village code (optional)" className="rounded border px-3 py-2 md:col-span-2" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="rounded border px-3 py-2">
            <option value="GENERAL">General</option>
            <option value="SCHEME">Scheme related</option>
            <option value="INFRA">Infrastructure</option>
            <option value="SERVICE">Service delivery</option>
          </select>
        </div>
        <textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe the issue…" className="h-28 w-full rounded border px-3 py-2" />
        <Captcha onVerify={setCaptcha} />
        <button disabled={saving} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Submitting…' : 'Submit'}
        </button>
        {msg && <div className="text-sm text-emerald-700">{msg}</div>}
      </form>
    </div>
  );
}
