import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Educational Platform',
  description:
    'An open-source educational platform for primary school children and beyond.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
