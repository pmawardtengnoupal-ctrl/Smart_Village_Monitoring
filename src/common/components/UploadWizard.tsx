// src/common/components/UploadWizard.tsx
'use client'
import React, { useMemo, useState } from 'react'
import { supabase } from '@data/supabaseClient'

type Flow = 'GEO'|'PEOPLE'|'ASSETS'|'SCHEMES'

/** Tailwind-friendly class combiner (no external deps) */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

/** Templates define the expected headers ( * = required, (json) = parse JSON ) */
const templates: Record<Flow,{name:string; headers:string[]}[]> = {
  GEO: [
    { name:'Districts', headers:['district_code*','name','meta(json)'] },
    { name:'Blocks', headers:['block_code*','district_code*','name','meta(json)'] },
    { name:'Villages', headers:[
      'village_code*','block_code*','district_code*','name','lat','lng','population','last_survey_at','terrain','meta(json)'
    ]},
    { name:'Hamlets', headers:['hamlet_code*','village_code*','name','meta(json)'] }
  ],
  PEOPLE: [
    { name:'Households', headers:[
      'village_code*','local_hh_no*','hamlet_code','head_name','phone','bpl_status','address_line','lat','lng','meta(json)'
    ]},
    { name:'Persons', headers:[
      'household_id*','person_seq*','name','gender','dob','age','phone','disability','schooling_status','occupation','meta(json)'
    ] }
  ],
  ASSETS: [
    { name:'Sector Assets', headers:[
      'asset_type_key*','village_code*','hamlet_code','status','attrs(json)','lat','lng','meta(json)'
    ] }
  ],
  SCHEMES: [
    { name:'Schemes Registry', headers:[
      'scheme_code*','name*','department_code','description_short','eligibility(json)','documents_required(json)','is_public','meta(json)'
    ]},
    { name:'Coverage', headers:[
      'scheme_code*','village_code*','status*','beneficiaries_count','last_update_at','meta(json)'
    ] }
  ]
}

function Badge({ children }:{children:React.ReactNode}) {
  return <span className="inline-block rounded border px-2 py-0.5 text-xs">{children}</span>
}

/** Robust-ish CSV splitter for a single line (handles quoted commas & quotes) */
function splitCSVLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i=0;i<line.length;i++){
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i+1] === '"') { cur += '"'; i++ } // escaped quote
      else inQ = !inQ
    } else if (ch === ',' && !inQ) {
      out.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map(s => s.trim())
}

/** Parse CSV text -> headers + records (string values) */
function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (!lines.length) return { hs: [] as string[], rows: [] as Record<string,string>[] }
  const hs = splitCSVLine(lines[0])
  const rows: Record<string,string>[] = []
  for (let i=1;i<lines.length;i++){
    const vals = splitCSVLine(lines[i])
    const rec: Record<string,string> = {}
    hs.forEach((h,idx)=>{ rec[h] = vals[idx] ?? '' })
    rows.push(rec)
  }
  return { hs, rows }
}

/** Convert fields that are declared as (json) in template */
function coerceJsonFields(rec: any, headers: string[]) {
  headers.forEach(h => {
    if (h.endsWith('(json)')) {
      const key = h.replace('(json)','')
      if (key in rec) {
        const raw = rec[key]
        if (typeof raw === 'string' && raw.trim().length) {
          try { rec[key] = JSON.parse(raw) }
          catch { /* leave as string if not valid JSON */ }
        }
      }
    }
  })
  return rec
}

/** Choose an entity_pk for staging_changes consistently */
function pickEntityPk(sheet: string, r: Record<string,any>): string|null {
  switch (sheet) {
    case 'Districts': return r.district_code || null
    case 'Blocks': return r.block_code || null
    case 'Villages': return r.village_code || null
    case 'Hamlets': return r.hamlet_code || null
    case 'Households': return r.local_hh_no || r.village_code || null  // local pairing; reviewer resolves
    case 'Persons': return r.household_id || null
    case 'Sector Assets': return r.asset_id || null
    case 'Schemes Registry': return r.scheme_code || null
    case 'Coverage': return `${r.scheme_code || ''}:${r.village_code || ''}` || null
    default: return null
  }
}

const entityMap: Record<string,string> = {
  'Districts': 'districts',
  'Blocks': 'blocks',
  'Villages': 'villages',
  'Hamlets': 'hamlets',
  'Households':'households',
  'Persons':'persons',
  'Sector Assets':'sector_assets',
  'Schemes Registry':'schemes_registry',
  'Coverage':'scheme_status_by_village'
}

export default function UploadWizard({ flow }:{ flow: Flow }) {
  const [sheet, setSheet] = useState(templates[flow][0].name)
  const [file, setFile] = useState<File|undefined>()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|undefined>()

  const headers = useMemo(()=>templates[flow].find(x=>x.name===sheet)!.headers, [flow, sheet])

  async function onUpload() {
    if (!file) return setMsg('Please select a CSV file')
    setMsg(undefined); setLoading(true)
    try{
      const text = await file.text()
      const { hs, rows } = parseCSV(text)

      // Validate required headers
      const required = headers.filter(h=>h.endsWith('*')).map(h=>h.replace('*','').replace('(json)',''))
      const missing = required.filter(r=>!hs.includes(r))
      if (missing.length) {
        setMsg('Missing required headers: '+missing.join(', '))
        setLoading(false)
        return
      }

      // Start an import job
      const { data: job, error: jobErr } = await supabase
        .from('import_jobs')
        .insert({
          file_name: file.name,
          import_type: flow,
          status: 'PENDING'
        })
        .select()
        .single()
      if (jobErr) throw jobErr

      // Prepare staging payloads
      const entity = entityMap[sheet]
      const payloads = rows.map(recRaw => {
        // Normalize: remove the * and (json) qualifiers from template keys
        const rec: any = {}
        Object.keys(recRaw).forEach(k => rec[k] = recRaw[k])

        // Coerce JSON fields if present
        const headerDefs = headers
        coerceJsonFields(rec, headerDefs)

        return {
          entity,
          entity_pk: pickEntityPk(sheet, rec),
          payload_after: rec,
          source: 'UPLOAD',
          job_id: job.id
        }
      })

      // Insert in chunks
      let idx = 0
      while (idx < payloads.length) {
        const chunk = payloads.slice(idx, idx+500)
        const { error } = await supabase.from('staging_changes').insert(chunk)
        if (error) throw error
        idx += 500
      }

      await supabase.from('import_jobs').update({ status: 'VALIDATING' }).eq('id', job.id)

      setRows(rows.slice(0, 50))
      setMsg(`Uploaded ${rows.length} rows to staging (job ${job.id}). Open Validation Queue to review.`)
    }catch(e:any){
      setMsg(e.message || 'Upload failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Sheet selector */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm font-medium">Sheet:</div>
        <div className="flex flex-wrap gap-2">
          {templates[flow].map(t=>{
            const active = t.name===sheet
            return (
              <button
                key={t.name}
                onClick={()=>setSheet(t.name)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm transition-colors',
                  active ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-slate-50'
                )}>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Header help */}
      <div className="rounded-lg border bg-white p-3">
        <div className="mb-2 text-sm text-slate-600">
          Required headers ( * ) — JSON fields marked with <span className="font-mono text-xs">(json)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {headers.map(h => <Badge key={h}>{h}</Badge>)}
        </div>
      </div>

      {/* File input */}
      <div className="flex items-center gap-3">
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0])} />
        <button
          onClick={onUpload}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Uploading…' : 'Upload & Stage'}
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div className={cn(
          'rounded border p-3 text-sm',
          msg.toLowerCase().includes('missing') ? 'bg-rose-50 border-rose-200 text-rose-800'
                                               : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        )}>
          {msg}
        </div>
      )}

      {/* Preview */}
      {!!rows.length && (
        <div className="rounded-lg border bg-white">
          <div className="border-b p-2 text-sm font-medium">Preview (first 50 rows)</div>
          <div className="max-h-80 overflow-auto text-xs">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  {Object.keys(rows[0]).map(h=>(
                    <th key={h} className="border-b px-2 py-1 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r,i)=>(
                  <tr key={i} className="odd:bg-slate-50/50">
                    {Object.keys(rows[0]).map(h=>(
                      <td key={h} className="border-b px-2 py-1">
                        {typeof (r as any)[h] === 'object'
                          ? JSON.stringify((r as any)[h])
                          : (r as any)[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
