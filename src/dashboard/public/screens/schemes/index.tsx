'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@data/supabaseClient'
import Link from 'next/link'

export default function Schemes(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('schemes_registry').select('code,name,description_short,updated_at').eq('is_public',true).order('updated_at',{ascending:false})
    setRows(data||[])
  })() },[])
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map(r=>(
        <div key={r.code} className="rounded-xl border bg-white p-4 hover:shadow transition-shadow">
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-slate-500 mt-1">{r.description_short||'—'}</div>
          <div className="mt-3"><Link href={`/public/scheme/${r.code}`} className="text-emerald-700 underline">See details</Link></div>
        </div>
      ))}
      {!rows.length && <div className="rounded-xl border bg-white p-4">No public schemes yet.</div>}
    </div>
  )
}
