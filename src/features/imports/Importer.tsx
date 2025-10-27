'use client'
import React, { useState } from 'react'
import { supabase } from '@data/supabaseClient'

const SHEETS = [
  { key:'districts', label:'Districts' },
  { key:'blocks', label:'Blocks' },
  { key:'villages', label:'Villages' },
  { key:'hamlets', label:'Hamlets' },
  { key:'schemes_registry', label:'Schemes Registry' },
  { key:'scheme_status_by_village', label:'Scheme Status by Village' },
  { key:'sector_assets:ROADS', label:'Sector Assets — Roads' },
  { key:'sector_assets:HEALTH', label:'Sector Assets — Health' },
  { key:'sector_assets:POWER', label:'Sector Assets — Power' },
  { key:'sector_assets:POLICE', label:'Sector Assets — Police' },
  { key:'sector_assets:FIRE', label:'Sector Assets — Fire' },
  { key:'sector_assets:EDUCATION', label:'Sector Assets — Education' },
  { key:'sector_assets:PDS', label:'Sector Assets — PDS' },
  { key:'sector_assets:AWC', label:'Sector Assets — Anganwadi' },
  { key:'sector_assets:WATER', label:'Sector Assets — Water' },
  { key:'sector_assets:SANITATION', label:'Sector Assets — Sanitation' },
  { key:'grievances', label:'Grievances Seed (optional)' }
]

export default function Importer(){
  const [file, setFile] = useState<File|undefined>()
  const [sheet, setSheet] = useState<string>('')
  const [ok, setOk] = useState<string|undefined>()
  const [err, setErr] = useState<string|undefined>()
  const [busy, setBusy] = useState(false)

  async function upload(){
    setErr(undefined); setOk(undefined)
    if (!file) { setErr('Choose a file'); return }
    if (!sheet) { setErr('Pick a sheet type'); return }
    setBusy(true)
    try{
      // 1) Upload to storage (import-files)
      const bucket = 'import-files'
      await supabase.storage.createBucket(bucket, { public: false }).catch(()=>{})
      const path = `${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (upErr) throw upErr

      // 2) Create import_jobs row
      const { error: jobErr } = await supabase.from('import_jobs').insert({
        file_name: path,
        import_type: sheet.toUpperCase(),
        status: 'PENDING',
        report: {}
      } as any)
      if (jobErr) throw jobErr

      setOk('Uploaded. Validation will start shortly.')
    }catch(e:any){ setErr(e.message) }
    finally{ setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <div className="text-lg font-semibold">Excel/CSV Import</div>
        <div className="text-sm text-slate-600">Uploads the file, creates an import job, and queues for validation.</div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <input type="file" accept=".xlsx,.xls,.csv" onChange={e=>setFile(e.target.files?.[0])} className="rounded border px-3 py-2"/>
        <select className="rounded border px-3 py-2" value={sheet} onChange={e=>setSheet(e.target.value)}>
          <option value="">Pick a sheet type</option>
          {SHEETS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button disabled={busy} onClick={upload} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50">
          {busy ? 'Uploading…' : 'Create Import Job'}
        </button>
      </div>
      {ok && <div className="rounded border bg-emerald-50 p-3 text-sm text-emerald-700">{ok}</div>}
      {err && <div className="rounded border bg-rose-50 p-3 text-sm text-rose-700">{err}</div>}
    </div>
  )
}
