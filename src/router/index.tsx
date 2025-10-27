'use client';
import React from 'react';
import type { RouteParams } from './types';
import { matchAuth } from './auth';
import { matchPublic } from './public';
import { matchDashboard } from './dashboard';
import AppShell from '@common/layouts/AppShell';

function resolveSection(pathFirst: string | undefined): 'public'|'auth'|'dashboard' {
  if (pathFirst === 'auth') return 'auth';
  if (pathFirst === 'dashboard') return 'dashboard';
  return 'public';
}

export default function Router({ params }: { params: RouteParams }) {
  const slug = (params.all ?? []);
  const section = resolveSection(slug[0]);
  const tail = section === 'public' ? slug.slice(1) :
               section === 'auth' ? slug.slice(1) :
               slug.slice(1);
  let match;

  if (section === 'auth') match = matchAuth(tail);
  else if (section === 'dashboard') match = matchDashboard(tail);
  else match = matchPublic(tail);

  const Comp = match?.Comp ?? (() => <div />);
  const props = match?.props ?? {};

  // wrap with a shell when not public/auth if you prefer; here we wrap everything for consistency
  return (
    <AppShell>
      <Comp {...props} />
    </AppShell>
  );
}
