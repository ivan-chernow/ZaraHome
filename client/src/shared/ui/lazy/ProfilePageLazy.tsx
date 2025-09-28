'use client';

import { lazy } from 'react';
import LazyPage from '../LazyPage';
import MainLayout from '@/widgets/layout/MainLayout';

// Ленивая загрузка тяжелого компонента профиля
const ProfilePageContent = lazy(() => 
  import('@/widgets/profile/ui/ProfilePageContent').then(module => ({
    default: module.ProfilePageContent
  }))
);

/**
 * Ленивая загрузка страницы профиля
 */
const ProfilePageLazy: React.FC = () => {
  return (
    <MainLayout>
      <LazyPage>
        <ProfilePageContent />
      </LazyPage>
    </MainLayout>
  );
};

export default ProfilePageLazy;
