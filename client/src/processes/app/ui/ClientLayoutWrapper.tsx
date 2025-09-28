'use client';

import React, { useMemo } from 'react';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import AuthCheck from '@/processes/session/init-auth-check/ui/AuthCheck';
import { useSelector } from 'react-redux';
import LoginModal from '@/features/auth/ui/LoginModal';
import MainLayout from '@/widgets/layout/MainLayout';
import { RootState } from '@/shared/config/store/store';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = React.memo(
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
        <AuthCheck />
        <MainLayout>{children}</MainLayout>
      </>
    );
  }
);

ClientLayoutWrapper.displayName = 'ClientLayoutWrapper';

export default ClientLayoutWrapper;
