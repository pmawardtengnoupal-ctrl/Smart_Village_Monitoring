'use client'
import UploadWizard from '@common/components/UploadWizard'
import { useState } from 'react'

export default function ImportsScreen() {
  const [flow, setFlow] = useState<'GEO'|'PEOPLE'|'ASSETS'|'SCHEMES'>('GEO')
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bulk Uploads</h1>
        <div className="rounded-full border bg-white p-1">
          {(['GEO','PEOPLE','ASSETS','SCHEMES'] as const).map(f=>(
            <button key={f} onClick={()=>setFlow(f)}
              className={`px-3 py-1 text-sm rounded-full ${flow===f ? 'bg-emerald-600 text-white':'hover:bg-slate-50'}`}>
              {f==='GEO'?'Masters (Geo)':f==='PEOPLE'?'People (HH/Persons)':f==='ASSETS'?'Assets':'Schemes'}
            </button>
          ))}
        </div>
      </div>
      <UploadWizard flow={flow}/>
      <p className="text-xs text-slate-500">After upload, open <b>Validation Queue</b> to review and approve.</p>
    </div>
  )
}
