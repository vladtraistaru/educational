import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/language';
import { getLanguage } from '@/lib/language-server';
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
    <html lang={lang}>
      <body>
        <LanguageProvider initialLanguage={lang}>
          <main className="container">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
