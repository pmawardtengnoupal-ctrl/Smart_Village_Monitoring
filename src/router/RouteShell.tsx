'use client';
import React from 'react';
import PublicHome from '@dashboard/public/screens/home';
import AuthModal from '@common/components/AuthModal';
import { matchDashboard } from '@router/dashboard';

export default function RouteShell({
  section,
  slug = [],
}: {
  section: 'public' | 'auth' | 'dashboard';
  slug?: string[];
}) {
  if (section === 'public') {
    // Public landing
    return <PublicHome />;
  }

  if (section === 'auth') {
    // Show the account drawer content in-page as a full-screen for now
    return (
      <div className="max-w-5xl mx-auto p-6">
        <AuthModal standalone />
      </div>
    );
  }

  // dashboard
  const m = matchDashboard(slug);
  if (!m) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Not found</h1>
        <p className="text-slate-600 mt-2">Dashboard route “/{slug.join('/')}” wasn’t recognized.</p>
      </div>
    );
  }
  const Comp = m.Comp;
  return <Comp {...(m.props || {})} />;
}
