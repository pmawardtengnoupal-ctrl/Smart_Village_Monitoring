'use client';
import React from 'react';
import AuthModal from '@common/components/AuthModal';

export default function LoginScreen() {
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-3 text-lg font-semibold">Welcome back</div>
      <AuthModal initialTab="login" standalone />
    </div>
  );
}
