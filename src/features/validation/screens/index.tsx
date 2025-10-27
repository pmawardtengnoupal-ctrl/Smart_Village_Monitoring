'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@data/supabaseClient'

type VQ = {
  id: string; stage: 'SURVEY'|'VILLAGE'|'BLOCK'|'SD'|'DC'; state:'SUBMITTED'|'APPROVED'|'RETURNED';
  entity: string; entity_pk: string|null; payload_before: any; payload_after: any; created_at: string
}

export default function ValidationQueueScreen(){
  const [rows,setRows]=useState<VQ[]>([])
  const [sel,setSel]=useState<VQ|null>(null)
  const [loading,setLoading]=useState(false)
  const stages = ['SURVEY','VILLAGE','BLOCK','SD','DC'] as const

  async function load(){
    const { data } = await supabase.from('validation_queue')
      .select('id,stage,state,entity,entity_pk,payload_before,payload_after,created_at')
      .order('created_at',{ ascending:false }).limit(200)
    setRows(data as VQ[] ?? [])
  }

  async function act(vq:VQ, action:'APPROVE'|'RETURN'){
    setLoading(true)
    try{
      const { data, error } = await supabase.rpc('apply_approval', { p_vq_id: vq.id, p_action: action, p_note: action==='RETURN'?'Needs correction':'' })
      if (error) throw error
      await load()
      setSel(null)
    }catch(e:any){
      alert(e.message||'Action failed')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="grid gap-4 md:grid-cols-[1fr,420px]">
      <div className="rounded-lg border bg-white">
        <div className="flex items-center gap-2 border-b p-2 text-sm">
          {stages.map(s=><span key={s} className="rounded border px-2 py-0.5">{s}</span>)}
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="px-2 py-1 text-left">Entity</th>
                <th className="px-2 py-1 text-left">Stage</th>
                <th className="px-2 py-1 text-left">State</th>
                <th className="px-2 py-1 text-left">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} className="cursor-pointer odd:bg-slate-50/50 hover:bg-emerald-50" onClick={()=>setSel(r)}>
                  <td className="px-2 py-1">{r.entity}</td>
                  <td className="px-2 py-1">{r.stage}</td>
                  <td className="px-2 py-1">{r.state}</td>
                  <td className="px-2 py-1">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!rows.length && <tr><td className="px-2 py-3 text-slate-500">Queue is empty.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-3">
        <div className="mb-2 text-sm font-medium">Review</div>
        {!sel && <div className="text-sm text-slate-500">Select a row to review.</div>}
        {sel && (
          <div className="space-y-3 animate-[fadeIn_.2s_ease]">
            <div className="text-sm">Entity: <b>{sel.entity}</b></div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded border p-2">
                <div className="mb-1 text-xs text-slate-500">Before</div>
                <pre className="max-h-64 overflow-auto text-xs">{JSON.stringify(sel.payload_before,null,2)}</pre>
              </div>
              <div className="rounded border p-2">
                <div className="mb-1 text-xs text-slate-500">After</div>
                <pre className="max-h-64 overflow-auto text-xs">{JSON.stringify(sel.payload_after,null,2)}</pre>
              </div>
            </div>

            <div className="flex gap-2">
              <button disabled={loading} onClick={()=>act(sel,'RETURN')}
                className="rounded border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-60">Return</button>
              <button disabled={loading} onClick={()=>act(sel,'APPROVE')}
                className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60">
                Approve
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
