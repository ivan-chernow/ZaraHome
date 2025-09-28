import { Inter, Roboto, Ysabeau_SC } from 'next/font/google';
import '../../public/assets/styles/globals.css';
import React from 'react';
import { Providers } from '@/shared/providers/StoreProvider';
import { Metadata } from 'next';
import ClientLayoutWrapper from './ClientLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const ysabeau = Ysabeau_SC({
  subsets: ['latin'],
  variable: '--font-ysabeau',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Мета-данные для SEO
export const metadata: Metadata = {
  title: {
    default: 'ZaraHome - Домашний уют и стиль',
    template: '%s | ZaraHome',
  },
  description:
    'ZaraHome - ваш надежный партнер в мире домашнего уюта и стиля. Широкий ассортимент товаров для дома по доступным ценам.',
  keywords: [
    'домашний уют',
    'мебель',
    'текстиль',
    'декор',
    'аксессуары для дома',
  ],
  authors: [{ name: 'ZaraHome Team' }],
  creator: 'ZaraHome',
  publisher: 'ZaraHome',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zarahome.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://zarahome.ru',
    title: 'ZaraHome - Домашний уют и стиль',
    description: 'Широкий ассортимент товаров для дома по доступным ценам',
    siteName: 'ZaraHome',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZaraHome - Домашний уют и стиль',
    description: 'Широкий ассортимент товаров для дома по доступным ценам',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${roboto.variable} ${ysabeau.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={ysabeau.className} suppressHydrationWarning>
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
