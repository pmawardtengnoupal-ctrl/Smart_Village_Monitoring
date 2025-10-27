'use client';

import React from 'react';
import Drawer from '@common/components/Drawer';

type Props = {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left';
  children: React.ReactNode;
};

/**
 * AccountDrawer
 * Wrapper around Drawer that sets the panel width via CSS classes (not a prop).
 * Animated slide, backdrop, and a simple header area. Drop any content via children.
 */
export default function AccountDrawer({ open, onClose, side = 'right', children }: Props) {
  return (
    <Drawer open={open} onClose={onClose} side={side}>
      {/* Set width here (replace 'max-w-md' if you want a different size) */}
      <div className="w-[380px] max-w-[90vw] h-full flex flex-col">
        {/* Optional sticky header inside the drawer */}
        <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Account</div>
            <button
              onClick={onClose}
              className="rounded px-2 py-1 text-xs border hover:bg-slate-50 transition"
              aria-label="Close account drawer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content area (scrollable) */}
        <div className="flex-1 overflow-auto p-4 animate-fadeIn">
          {children}
        </div>
      </div>
    </Drawer>
  );
}
