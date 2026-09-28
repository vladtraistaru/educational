import type { Metadata } from 'next';
import Script from 'next/script';
import { LanguageProvider } from '@/lib/language';
import { getLanguage } from '@/lib/language-server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Educational Platform',
  description:
    'An open-source educational platform for primary school children and beyond.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLanguage();

  return (
    <html lang={lang} data-theme="light">
      <body>
        <LanguageProvider initialLanguage={lang}>
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </LanguageProvider>
        {/* Umami analytics (stats.traistaru.net). Cookieless; tracks SPA route changes itself. */}
        <Script
          src="https://stats.traistaru.net/script.js"
          data-website-id="f7fc9381-fab0-4894-b30f-2149179ec3b6"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
