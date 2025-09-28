'use client';

import React from 'react';
import NavigationProgress from '@/shared/ui/NavigationProgress';
import AuthCheck from '@/processes/session/init-auth-check/ui/AuthCheck';
import { useSelector } from 'react-redux';
import LoginModal from '@/features/auth/ui/LoginModal';
import MainLayout from '@/widgets/layout/MainLayout';
import { RootState } from '@/shared/config/store/store';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({
  children,
}) => {
  const { isOpenAuth } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {isOpenAuth && <LoginModal />}
      <NavigationProgress />
      <AuthCheck />
      <MainLayout>
        {children}
      </MainLayout>
    </>
  );
};

export default ClientLayoutWrapper;
