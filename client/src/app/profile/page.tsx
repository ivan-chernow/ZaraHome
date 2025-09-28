'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы профиля
const ProfilePageContent = lazy(() => 
  import('@/widgets/profile/ui/ProfilePageContent').then(module => ({ 
    default: module.ProfilePageContent 
  }))
);

// Скелетон для загрузки
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={50} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfilePageContent />
  </Suspense>
);

export default ProfilePage;
