import React from 'react';
import type { RouteParams } from '@router/types';
import AuthModal from '@common/components/AuthModal';

export default function Page({ params }: { params: RouteParams }) {
  // You can branch on usePathname() if needed
  return (
    <div className="max-w-3xl mx-auto p-3">
      <AuthModal standalone />
    </div>
  );
}
