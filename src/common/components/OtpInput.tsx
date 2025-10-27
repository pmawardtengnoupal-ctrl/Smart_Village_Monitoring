'use client';
import React, { useRef } from 'react';

export default function OtpInput({ value, onChange }:{ value:string; onChange:(v:string)=>void }) {
  const refs = Array.from({ length: 6 }, ()=>useRef<HTMLInputElement>(null));

  const setChar = (i:number, ch:string) => {
    const chars = value.padEnd(6, ' ').split('');
    chars[i] = ch.replace(/\D/g,'').slice(0,1) || ' ';
    const next = chars.join('').trim();
    onChange(next);
    if (ch && i<5) refs[i+1].current?.focus();
  };

  return (
    <div className="flex gap-2">
      {refs.map((r, i)=>(
        <input key={i} ref={r}
          className="w-10 h-10 text-center border rounded"
          maxLength={1}
          value={value[i] || ''}
          onChange={e=>setChar(i, e.target.value)}
        />
      ))}
    </div>
  );
}
