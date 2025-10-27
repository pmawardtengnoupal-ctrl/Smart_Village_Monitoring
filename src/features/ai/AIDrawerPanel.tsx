'use client'
import React, { useState } from 'react'
import { supabase } from '@data/supabaseClient'

type Msg = { role:'user'|'ai', text:string }

async function answer(text: string): Promise<string> {
  const t = text.toLowerCase()

  // Track grievance by case id: "track case CASE123"
  const mCase = t.match(/(case[-\s]?id|case)\s*([A-Z0-9\-]+)/i)
  if (mCase) {
    const id = mCase[2].toUpperCase()
    const { data } = await supabase.from('grievances').select('public_case_id,state,category,updated_at').eq('public_case_id', id).maybeSingle()
    if (!data) return `I couldn't find case ${id}.`
    return `Case ${id}: ${data.state} (category ${data.category}). Last updated ${new Date(data.updated_at).toLocaleString()}.`
  }

  // Eligibility: "am i eligible for SCM001 in V001"
  const mElig = t.match(/eligible.*(for|scheme)\s+([A-Z0-9_]+).*in\s+([A-Z0-9]+)/i)
  if (mElig) {
    const scheme = mElig[2].toUpperCase()
    const village = mElig[3].toUpperCase()
    const s = await supabase.from('schemes_registry').select('code,name,eligibility').eq('code', scheme).maybeSingle()
    if (!s.data) return `I couldn't find scheme ${scheme}.`
    const v = await supabase.from('v_public_village_profile').select('population,gap_score').eq('village_code', village).maybeSingle()
    const pop = v.data?.population ?? 'unknown'
    const base = s.data.eligibility || {}
    return `Eligibility summary for ${s.data.name}:
• Village ${village} population: ${pop}
• Base rules: ${JSON.stringify(base)}
(For exact determination, apply via the scheme page; officers validate documents.)`
  }

  // Where to apply
  if (t.includes('how to apply') || t.includes('where to apply')) {
    return `Open the Schemes list → select a scheme → click "See eligibility". For department-run schemes, you’ll find the officer contact on that page.`
  }

  return `I can help you:
• Track a grievance: "track case CASE123"
• Check scheme eligibility: "eligible for SCM001 in V001"
• Ask how to apply for a scheme
• Find your village: "find village <name>"`
}

export default function AIDrawerPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { role:'ai', text:'Hi! Ask me about schemes, your village, or how to file/track a grievance.' }
  ])
  const [input, setInput] = useState('')

  async function send() {
    if (!input.trim()) return
    const q = input
    setMessages(m => [...m, { role:'user', text: q }])
    setInput('')
    const a = await answer(q)
    setMessages(m => [...m, { role:'ai', text: a }])
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem-64px)] flex-col gap-3">
      <div className="flex-1 space-y-2 overflow-y-auto rounded border p-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role==='ai' ? 'text-slate-700' : 'text-emerald-700'}>
            <span className="text-xs uppercase">{m.role}</span>
            <div className="rounded bg-slate-50 p-2">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && send()}
          placeholder="Ask anything…"
          className="flex-1 rounded border px-3 py-2"
        />
        <button onClick={send} className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">Send</button>
      </div>
    </div>
  )
}
