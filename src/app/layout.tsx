// src/app/layout.tsx
import './globals.css';
import RegisterSW from './_components/RegisterSW';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

/**
 * Ab Next 13+/15 gehört themeColor in den viewport-Export (nicht metadata).
 * Außerdem erzwingen wir "light" – kein automatisches Dark-Theme in Safari.
 */
export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: { default: 'CloFind – Bildsuche für Mode', template: '%s | CloFind' },
  description: 'Finde ähnliche Outfits per Bild-Upload – visuelle Produktsuche mit CloFind.',
  icons: { icon: '/favicon.ico' },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} ${geistSans.variable} min-h-screen bg-white text-gray-900 antialiased`}
      >
        <RegisterSW />
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
