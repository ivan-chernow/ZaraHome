'use client';

import React, { useMemo } from 'react';
import { Providers } from '@/shared/providers/StoreProvider';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import AuthCheck from '@/processes/session/init-auth-check/ui/AuthCheck';
import { useSelector } from 'react-redux';
import LoginModal from '@/features/auth/ui/LoginModal';
import MainLayout from '@/widgets/layout/MainLayout';
import { RootState } from '@/shared/config/store/store';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = React.memo(
  ({ children }) => {
    const { isOpenAuth } = useSelector((state: RootState) => state.auth);

    // Мемоизируем рендер модального окна
    const modalContent = useMemo(() => {
      return isOpenAuth ? <LoginModal /> : null;
    }, [isOpenAuth]);

    return (
      <Providers>
        {modalContent}
        <NavigationProgress />
        <AuthCheck />
        <MainLayout>{children}</MainLayout>
      </Providers>
    );
  }
);

AppLayout.displayName = 'AppLayout';
