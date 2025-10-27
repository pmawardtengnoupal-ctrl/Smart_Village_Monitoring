import type { Metadata } from 'next';
import Providers from '@common/components/Providers';
import AppHeader from '@common/layouts/AppHeader';
import '../styles/global.css'; // <-- this path is correct for src/app/layout.tsx

export const metadata: Metadata = {
  title: 'Smart Village Monitoring',
  description: 'District-wide transparency: schemes, infrastructure, grievances.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>
          <AppHeader />
          <main className="mx-auto max-w-7xl p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
