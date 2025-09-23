// src/app/layout.tsx
import './globals.css';
import RegisterSW from './_components/RegisterSW';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: { default: 'CloFind – Bildsuche für Mode', template: '%s | CloFind' },
  description: 'Finde ähnliche Outfits per Bild-Upload – visuelle Produktsuche mit CloFind.',
  themeColor: '#111827',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#111827" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.className} ${geistMono.variable} ${geistSans.variable} min-h-screen bg-gray-50 text-gray-900 antialiased`}
      >
        <RegisterSW />
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
