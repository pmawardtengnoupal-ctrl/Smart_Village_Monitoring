'use client';

import React, { ReactNode, useEffect } from 'react';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left';
  children: ReactNode;
};

export default function Drawer({ open, onClose, side = 'right', children }: DrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={[
        'fixed inset-0 z-50',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      ].join(' ')}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          'absolute inset-0 bg-black/40 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        ].join(' ')}
      />

      {/* Panel */}
      <div
        className={[
          'absolute top-0 h-full w-[90vw] max-w-md bg-white shadow-xl border',
          'transition-transform will-change-transform',
          side === 'right'
            ? open ? 'right-0 translate-x-0' : '-right-0 translate-x-full'
            : open ? 'left-0 translate-x-0' : '-left-0 -translate-x-full'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
