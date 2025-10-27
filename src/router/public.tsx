'use client';
import React from 'react';
import Home from '@dashboard/public/screens/home';
import Villages from '@dashboard/public/screens/villages';
import Village from '@dashboard/public/screens/village';
import SchemeDetail from '@dashboard/public/screens/scheme-detail';
import AIPage from '@dashboard/public/screens/ai';

import type { RouteMatch } from './types';

const PUB: Record<string, any> = {
  '': Home,
  'villages': Villages,
  'village': Village,             // /public/village/[code]
  'scheme': SchemeDetail,         // /public/scheme/[code]
  'ai': AIPage,
};

export function matchPublic(slug: string[]): RouteMatch {
  const key = slug[0] ?? '';
  const Comp = PUB[key];
  if (!Comp) return { Comp: Home };
  if (key === 'village' && slug[1]) return { Comp, props: { code: slug[1] } };
  if (key === 'scheme' && slug[1]) return { Comp, props: { code: slug[1] } };
  return { Comp };
}
