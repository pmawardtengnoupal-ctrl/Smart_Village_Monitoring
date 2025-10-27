'use client';
import React, { useState } from 'react';

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={()=>setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-emerald-600 p-4 text-white shadow-lg transition hover:bg-emerald-700"
        aria-label="Open AI assistant"
      >
        ✨
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] overflow-hidden rounded-xl border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-2">
            <div className="text-sm font-semibold">AI Assistant</div>
            <button onClick={()=>setOpen(false)} className="text-slate-600 hover:text-slate-900">✕</button>
          </div>
          <div className="h-64 p-3 text-sm text-slate-500">Phase-2+ will wire real chat here.</div>
        </div>
      )}
    </>
  );
}
