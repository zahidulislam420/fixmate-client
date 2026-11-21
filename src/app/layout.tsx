import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'FixMate | Smart Device & Home Appliance Repair Platform',
  description:
    'On-demand repair booking platform connecting customers with verified technicians for smartphones, laptops, ACs, refrigerators, TVs, and appliances. Pay safely after service completion.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
