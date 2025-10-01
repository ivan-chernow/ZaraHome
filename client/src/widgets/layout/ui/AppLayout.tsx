'use client';

import React, { useMemo } from 'react';
import { Providers } from '@/shared/providers/StoreProvider';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import { AuthManager } from '@/widgets/auth/ui/AuthManager';
import { useSelector } from 'react-redux';
import LoginModal from '@/features/auth/ui/LoginModal';
import MainLayout from '@/widgets/layout/MainLayout';
import { RootState } from '@/shared/config/store/store';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = React.memo(
  ({ children }) => {
    return (
      <Providers>
        <AppContent>{children}</AppContent>
      </Providers>
    );
  }
);

const AppContent: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    const { isOpenAuth } = useSelector((state: RootState) => state.auth);

    // Мемоизируем рендер модального окна
    const modalContent = useMemo(() => {
      return isOpenAuth ? <LoginModal /> : null;
    }, [isOpenAuth]);

    return (
      <>
        {modalContent}
        <NavigationProgress />
        <AuthManager />
        <MainLayout>{children}</MainLayout>
      </>
    );
  }
);

AppContent.displayName = 'AppContent';

AppLayout.displayName = 'AppLayout';
