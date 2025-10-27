'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@data/supabaseClient'
import Link from 'next/link'

export default function VillageSearch() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{
    const run = async ()=>{
      if (!q || q.length<2) { setRows([]); return }
      const { data } = await supabase.rpc('search_villages', { q })
      setRows(data||[])
    }
    const id = setTimeout(run, 200)
    return ()=>clearTimeout(id)
  },[q])
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm font-semibold mb-2">Find my village</div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Type village name…" className="w-full rounded border px-3 py-2" />
      <div className="mt-3 max-h-64 overflow-auto divide-y">
        {rows.map((r:any)=>(
          <Link key={r.village_code} href={`/public/village?code=${r.village_code}`} className="block px-1 py-2 hover:bg-slate-50">
            <div className="text-sm font-medium">{r.village_name}</div>
            <div className="text-xs text-slate-500">{r.district_name} · {r.subdivision_name} · {r.block_name} • Pop {r.population||'—'} • Head {r.head_name||'—'}</div>
          </Link>
        ))}
        {!rows.length && q && <div className="text-xs text-slate-500 p-2">No matches</div>}
      </div>
    </div>
  )
}
