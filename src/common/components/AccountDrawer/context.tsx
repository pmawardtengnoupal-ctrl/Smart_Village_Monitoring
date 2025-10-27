'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Drawer from '@common/components/Drawer';

type View = 'account'|'contexts'|'auth';

type Ctx = {
  openAccount: () => void;
  openContexts: () => void;
  openAuth: () => void;
  close: () => void;
};

const DrawerCtx = createContext<Ctx | null>(null);

export function useAccountDrawer() {
  const c = useContext(DrawerCtx);
  if (!c) throw new Error('useAccountDrawer must be used within <AccountDrawerProvider>');
  return c;
}

export function AccountDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('auth');

  const api: Ctx = {
    openAccount: () => { setView('account'); setOpen(true); },
    openContexts: () => { setView('contexts'); setOpen(true); },
    openAuth: () => { setView('auth'); setOpen(true); },
    close: () => setOpen(false),
  };

  return (
    <DrawerCtx.Provider value={api}>
      {children}
      <Drawer open={open} onClose={()=>setOpen(false)} side="right">
        <div className="h-full flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="text-sm font-semibold capitalize">{view}</div>
            <button onClick={()=>setOpen(false)} className="text-sm underline">Close</button>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {view==='auth' && <AuthContent />}
            {view==='contexts' && <ContextsContent />}
            {view==='account' && <AccountContent />}
          </div>
        </div>
      </Drawer>
    </DrawerCtx.Provider>
  );
}

function AuthContent() {
  return (
    <div className="space-y-2 animate-[fadeIn_.2s_ease] text-sm">
      <div className="text-slate-600">Sign in / Sign up lives here (your AuthModal component can be rendered inline).</div>
    </div>
  );
}

function ContextsContent() {
  return (
    <div className="space-y-2 animate-[fadeIn_.2s_ease] text-sm">
      <div className="text-slate-600">Context switcher list here.</div>
    </div>
  );
}

function AccountContent() {
  return (
    <div className="space-y-2 animate-[fadeIn_.2s_ease] text-sm">
      <div className="text-slate-600">Account profile overview here.</div>
    </div>
  );
}
