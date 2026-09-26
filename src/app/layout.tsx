import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { BrandProjectProvider } from '@/context/brand-project-context';
import { ThemeProvider } from '@/context/theme-context';

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
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-nexus-950 text-nexus-100 antialiased selection:bg-emerald-500/30 selection:text-white transition-colors duration-150">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nexus_theme_v1');
                  var theme = saved === 'light' ? 'light' : 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <BrandProjectProvider>{children}</BrandProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
