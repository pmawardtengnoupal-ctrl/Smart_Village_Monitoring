'use client';
import React from 'react';
import ChatDock from '@features/ai/ChatDock';

export default function AIPage(){
  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Ask AI</div>
        <div className="text-sm text-slate-600">Try the floating dock button (bottom-right).</div>
      </div>
      <ChatDock />
    </div>
  );
}
