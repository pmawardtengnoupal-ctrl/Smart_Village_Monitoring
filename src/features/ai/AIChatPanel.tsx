'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@data/supabaseClient'

type Msg = { role:'user'|'assistant', text:string }

export default function AIChatPanel(){
  const [q,setQ]=useState('')
  const [items,setItems]=useState<Msg[]>([
    { role:'assistant', text:'Hi! Ask about schemes, eligibility, grievances, or gaps. (Results respect your role & scope.)' }
  ])
  const ref = useRef<HTMLDivElement>(null)

  async function ask(){
    if (!q.trim()) return
    const userMsg:Msg = { role:'user', text:q.trim() }
    setItems(prev=>[...prev, userMsg])

    // This is a placeholder call: replace with your secured API route that:
    // - reads role/scope from session
    // - runs parametrized SQL with RLS
    // - returns masked/aggregated answers
    const { data, error } = await supabase.rpc('ai_answer', { p_query: q.trim() })
    const ans = error ? ('(Error) '+error.message) : (data?.answer || 'No answer.')
    setItems(prev=>[...prev, { role:'assistant', text: ans }])
    setQ('')
    setTimeout(()=>ref.current?.scrollTo({top:999999, behavior:'smooth'}), 10)
  }

  useEffect(()=>{ ref.current?.scrollTo({top:999999}) },[items.length])

  return (
    <div className="flex h-[520px] flex-col rounded-xl border bg-white shadow-sm">
      <div ref={ref} className="flex-1 space-y-2 overflow-auto p-3">
        {items.map((m,i)=>(
          <div key={i} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role==='user' ? 'ml-auto bg-emerald-600 text-white' : 'bg-slate-50'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="border-t p-2">
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()}
            placeholder="e.g., Which villages need a PHC? or Am I eligible for SCM001?"
            className="flex-1 rounded border px-3 py-2"/>
          <button onClick={ask} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Ask</button>
        </div>
      </div>
    </div>
  )
}
