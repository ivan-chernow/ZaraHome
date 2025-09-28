'use client';

import React from 'react';
import Header from '@/widgets/header/ui/Header';
import Footer from '@/widgets/footer/ui/Footer';
import NavMenu from '@/widgets/nav-menu/ui/NavMenu';
import ScrollToTop from '@/shared/ui/ScrollToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = React.memo(({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <NavMenu />
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
