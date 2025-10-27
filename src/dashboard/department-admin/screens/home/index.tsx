'use client'
import React from 'react'
import Section from '@common/components/Section'

export default function DeptAdminHome() {
  return (
    <div className="space-y-6">
      <Section title="Department Admin — Overview">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded border p-4">Members (x)</div>
          <div className="rounded border p-4">Pending Approvals (x)</div>
          <div className="rounded border p-4">Imports (last run)</div>
        </div>
      </Section>
      <Section title="Actions">
        <div className="flex gap-3 flex-wrap">
          <a href="/dashboard/department-admin/members" className="px-4 py-2 rounded border hover:bg-slate-50">Manage members</a>
          <a href="/dashboard/department-admin/features" className="px-4 py-2 rounded border hover:bg-slate-50">Feature toggles</a>
          <a href="/dashboard/department-admin/validation" className="px-4 py-2 rounded border hover:bg-slate-50">Validation queue</a>
          <a href="/dashboard/department-admin/imports" className="px-4 py-2 rounded border hover:bg-slate-50">Imports</a>
        </div>
      </Section>
    </div>
  )
}
