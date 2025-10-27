'use client';
import React, { useEffect, useState } from 'react';
import { getAvailableContexts, setActiveContext, landingForRole } from '@auth/services/session';
import type { ContextView } from '@auth/services/types';
import { useRouter } from 'next/navigation';

export default function ContextSwitcher({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [list, setList] = useState<ContextView[]>([]);
  const [sel, setSel] = useState<ContextView | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => setList(await getAvailableContexts()))();
  }, []);

  async function onSwitch() {
    if (!sel) return;
    setSaving(true);
    try {
      await setActiveContext(sel);
      onClose?.();
      router.push(landingForRole(sel.role));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="text-sm font-medium">Switch context</div>
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {list.length === 0 && <div className="text-xs text-slate-500">No alternate context found.</div>}

        {list.map((c, idx) => {
          // department hints (optional fields)
          const dept =
            'department_code' in c && c.department_code
              ? ` • ${c.department_code}${'dept_role' in c && c.dept_role ? ` (${c.dept_role})` : ''}`
              : '';

          return (
            <label
              key={idx}
              className="flex items-center gap-2 p-2 rounded border hover:bg-slate-50 cursor-pointer"
            >
              <input type="radio" name="ctx" onChange={() => setSel(c)} />
              <div className="text-sm">
                <div className="font-medium">
                  {c.role}
                  {dept}
                </div>
                <div className="text-xs text-slate-500">
                  {c.scope_district_code ? `District ${c.scope_district_code}` : ''}
                  {c.scope_block_code ? ` • Block ${c.scope_block_code}` : ''}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <button
        disabled={!sel || saving}
        onClick={onSwitch}
        className="w-full rounded bg-emerald-600 text-white py-2 hover:bg-emerald-700 disabled:opacity-50"
      >
        {saving ? 'Switching…' : 'Switch'}
      </button>
    </div>
  );
}
