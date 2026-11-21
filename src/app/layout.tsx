import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import LayoutShell from '@/components/LayoutShell';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'FixMate | Smart Device & Home Appliance Repair Platform',
  description:
    'On-demand repair booking platform connecting customers with verified technicians for smartphones, laptops, ACs, refrigerators, TVs, and appliances. Pay safely after service completion.',
  keywords: [
    'appliance repair',
    'device servicing',
    'laptop repair',
    'smartphone screen fix',
    'AC gas refilling',
    'refrigerator repair',
    'verified technicians',
    'Dhaka repair service',
    'FixMate',
  ],
  authors: [{ name: 'FixMate Platform' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'FixMate - Smart Device & Appliance Repair Service',
    description:
      'Book verified repair technicians with real-time job tracking and safe Stripe payments after service delivery.',
    url: 'https://fixmate.com',
    siteName: 'FixMate',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FixMate | Repair Service Platform',
    description:
      'Book verified technicians and pay only after your repair is thoroughly completed.',
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
