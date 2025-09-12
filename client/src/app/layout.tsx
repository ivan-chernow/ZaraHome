'use client';

import { Inter, Roboto, Ysabeau_SC } from 'next/font/google';
import '../../public/assets/styles/globals.css';
import React from 'react';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import AuthCheck from '@/processes/session/init-auth-check/ui/AuthCheck';
import { useSelector } from 'react-redux';
import LoginModal from '@/features/auth/ui/LoginModal';
import { RootState } from '@/shared/config/store/store';
import { Providers } from '@/shared/providers/StoreProvider';

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

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${roboto.variable} ${ysabeau.variable}`}
    >
      <body className={ysabeau.className}>
        <Providers>
          <LayoutWithModal>{children}</LayoutWithModal>
        </Providers>
      </body>
    </html>
  );
};

interface LayoutWithModalProps {
  children: React.ReactNode;
}

const LayoutWithModal: React.FC<LayoutWithModalProps> = ({ children }) => {
  const { isOpenAuth } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {isOpenAuth && <LoginModal />}
      <NavigationProgress />
      <AuthCheck />
      {children}
    </>
  );
};

export default RootLayout;
