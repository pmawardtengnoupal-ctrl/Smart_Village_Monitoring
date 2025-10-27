'use client'
import React, { useState } from 'react'
import Turnstile from '@common/components/Turnstile'
import { supabase } from '@data/supabaseClient'

export default function PublicGrievanceForm() {
  const [village, setVillage] = useState('')
  const [category, setCategory] = useState('')
  const [details, setDetails] = useState('')
  const [captcha, setCaptcha] = useState<string | undefined>()
  const [caseId, setCaseId] = useState<string | undefined>()
  const [err, setErr] = useState<string | undefined>()

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setErr(undefined)
    try{
      if (!captcha) throw new Error('Please pass CAPTCHA')
      const public_case_id = 'CASE-' + Math.random().toString(36).slice(2,8).toUpperCase()
      const { error } = await supabase.from('grievances').insert({
        public_case_id,
        category: category || 'GENERAL',
        details,
        village_code: village || null
      } as any)
      if (error) throw error
      setCaseId(public_case_id)
    }catch(e:any){ setErr(e.message) }
  }

  if (caseId) return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <div className="text-lg font-semibold">Submitted</div>
      <div className="text-sm">Your case id is <b>{caseId}</b>. Please save it to track status.</div>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="w-full rounded border px-3 py-2" placeholder="Village code (optional)" value={village} onChange={e=>setVillage(e.target.value)} />
      <select className="w-full rounded border px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}>
        <option value="">Select category</option>
        <option value="ROAD">Road</option>
        <option value="WATER">Water</option>
        <option value="HEALTH">Health</option>
        <option value="POWER">Power</option>
        <option value="EDU">Education</option>
        <option value="OTHER">Other</option>
      </select>
      <textarea className="w-full rounded border px-3 py-2" rows={5} placeholder="Describe the issue…" value={details} onChange={e=>setDetails(e.target.value)} />
      <Turnstile onVerify={setCaptcha} />
      {err && <p className="text-sm text-rose-600">{err}</p>}
      <button className="w-full rounded bg-emerald-600 py-2 text-white hover:bg-emerald-700">Submit grievance</button>
    </form>
  )
}
