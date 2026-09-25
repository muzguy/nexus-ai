import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { BrandProjectProvider } from '@/context/brand-project-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEXUS — AI Brand Intelligence Platform',
  description:
    'Transform rough startup and product ideas into coherent, launch-ready brand systems through a multi-stage cognitive pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-nexus-950 text-nexus-100 antialiased selection:bg-indigo-500/30 selection:text-white">
        <BrandProjectProvider>{children}</BrandProjectProvider>
      </body>
    </html>
  );
}
