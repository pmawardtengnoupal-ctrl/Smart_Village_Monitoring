'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Drawer from '@common/components/Drawer';

type View = 'auth';

type Ctx = {
  openAuth: () => void;
  close: () => void;
  isOpen: boolean;
  view: View | null;
};

const AuthCtx = createContext<Ctx | null>(null);

export default function AuthDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View | null>(null);

  const openAuth = useCallback(() => {
    setView('auth');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setView(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ openAuth, close, isOpen, view }}>
      {children}

      {/* Drawer host (animated) */}
      <Drawer open={isOpen} onClose={close} side="right">
        {/* Swap this for your full AuthModal, or keep a lightweight entry */}
        <div className="w-[380px] max-w-[90vw]">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Account</div>
            <div className="text-xs text-slate-500">Sign in • Sign up • Forgot password</div>
          </div>
          <div className="p-4 animate-fadeIn">
            {/* Mount your AuthModal component here */}
            {/* <AuthModal initialTab="login" onDone={close} /> */}
            <div className="text-sm text-slate-600">
              Drop your <b>AuthModal</b> here. (Currently stubbed so the drawer compiles.)
            </div>
            <button
              onClick={close}
              className="mt-4 w-full rounded bg-emerald-600 py-2 text-white hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        </div>
      </Drawer>
    </AuthCtx.Provider>
  );
}

export function useAuthDrawer() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuthDrawer must be used within AuthDrawerProvider');
  return ctx;
}
