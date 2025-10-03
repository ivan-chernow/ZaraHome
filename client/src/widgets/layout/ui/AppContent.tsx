'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import { AuthManager } from '@/widgets/auth/ui/AuthManager';
import LoginModal from '@/features/auth/ui/LoginModal';
import MainLayout from '@/widgets/layout/MainLayout';
import { RootState } from '@/shared/config/store/store';

interface AppContentProps {
  children: React.ReactNode;
}

export const AppContent: React.FC<AppContentProps> = React.memo(
  ({ children }) => {
    const { isOpenAuth } = useSelector((state: RootState) => state.auth);

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
