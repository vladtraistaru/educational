import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/language';
import { BreadcrumbProvider } from '@/lib/breadcrumb';
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
          <BreadcrumbProvider>
            <Header />
            <main className="container">{children}</main>
            <Footer />
          </BreadcrumbProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
