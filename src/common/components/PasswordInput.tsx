'use client';
import React, { useMemo, useState } from 'react';

export default function PasswordInput({ value, onChange }:{ value: string; onChange: (v:string)=>void }){
  const [show, setShow] = useState(false);

  const score = useMemo(()=>{
    // simple scoring (length + variety)
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  },[value]);

  return (
    <div className="space-y-1">
      <div className="flex rounded border">
        <input
          className="w-full px-3 py-2 outline-none"
          type={show ? 'text' : 'password'}
          placeholder="Password"
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
        <button type="button" onClick={()=>setShow(v=>!v)} className="px-3 text-sm">
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="h-1 w-full overflow-hidden rounded bg-slate-200">
        <div className="h-full transition-all" style={{ width: `${(score/4)*100}%`, background: score>=3 ? '#059669' : '#f59e0b' }} />
      </div>
      <div className="text-xs text-slate-600">Min 8 chars, 1 uppercase, 1 number, 1 special</div>
    </div>
  );
}
