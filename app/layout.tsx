import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prisbo – Business Management Suite | Complete SaaS Platform',
  description: 'Manage your customers, projects, teams, and analytics all in one integrated platform. Enterprise-grade business management SaaS.',
  keywords: 'business management, CRM, project management, analytics, team collaboration, SaaS, Prisbo',
  authors: [{ name: 'Prisbo Services' }],
  creator: 'Prisbo Services',
  publisher: 'Prisbo Services',
  metadataBase: new URL('https://www.prisboservices.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.prisboservices.com',
    siteName: 'Prisbo – Business Management Suite',
    title: 'Prisbo – Business Management Suite',
    description: 'Complete business management platform for CRM, projects, teams, and analytics.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prisbo – Business Management Suite',
    description: 'Complete business management platform for CRM, projects, teams, and analytics.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
