// src/common/layouts/Drawer.tsx
'use client';
import React from 'react';

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function Drawer({
  open, onClose, children, side='right', width='24rem'
}: { open: boolean; onClose: ()=>void; children: React.ReactNode; side?: 'left'|'right'; width?: string }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/30 transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed top-0 h-full bg-white shadow-xl transition-transform',
          side==='right' ? 'right-0' : 'left-0'
        )}
        style={{
          width,
          transform: `translateX(${open ? '0' : (side==='right' ? '100%' : '-100%')})`
        }}
      >
        {children}
      </div>
    </>
  );
}
