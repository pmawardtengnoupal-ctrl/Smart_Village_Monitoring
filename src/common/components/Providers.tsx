'use client';

import React from 'react';
import AuthDrawerProvider from '@common/components/AuthDrawerContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Wrap global client providers here (AuthDrawerProvider, Theme, Query, etc.)
  return (
    <AuthDrawerProvider>
      {children}
    </AuthDrawerProvider>
  );
}
