'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@data/supabaseClient'

type Village = { village_code:string; name:string; lat:number|null; lng:number|null; gap?:number }

export default function PublicMap(){
  const [rows, setRows] = useState<Village[]>([])

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('villages').select('village_code,name,lat,lng').limit(200)
    const { data: scores } = await supabase.from('ai_gap_scores').select('village_code,score').in('village_code', (data||[]).map(d=>d.village_code))
    const map: Record<string, number> = {}
    scores?.forEach(s=>map[s.village_code]=s.score)
    setRows((data||[]).map(d=>({ ...d, gap: map[d.village_code]||0 })))
  })() },[])

  // Fake projection to container (no tiles yet)
  function toXY(lat:number, lng:number, w:number, h:number){
    // simple equirectangular in district bbox – replace with Leaflet later
    const minLat=20, maxLat=28, minLng=92, maxLng=98 // tune to your state
    const x = ((lng-minLng)/(maxLng-minLng))*w
    const y = (1-((lat-minLat)/(maxLat-minLat)))*h
    return { x, y }
  }

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="absolute inset-0">
        {rows.filter(r=>r.lat && r.lng).map(r=>{
          const { x,y } = toXY(r.lat!, r.lng!, 900, 320)
          const color = r.gap! > 30 ? 'bg-rose-500' : r.gap! > 10 ? 'bg-amber-500' : 'bg-emerald-500'
          return (
            <div key={r.village_code}
              title={`${r.name} · gap ${r.gap}`}
              className={`pointer-events-auto absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${color} shadow animate-ping-slow`}
              style={{ left: x, top: y }}
            />
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 text-center text-xs text-slate-500">
        Animated markers (gap score). Tiles/Leaflet hook in Phase-3 or when you’re ready.
      </div>
      <style>{`
        @keyframes pingSlow { 0% { transform: scale(1); opacity: .9 } 70% { transform: scale(1.6); opacity: .2 } 100% { opacity: 0 } }
        .animate-ping-slow { animation: pingSlow 2.5s cubic-bezier(0,0,.2,1) infinite; }
      `}</style>
    </div>
  )
}
