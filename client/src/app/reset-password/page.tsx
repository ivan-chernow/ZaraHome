'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы сброса пароля
const ResetPasswordPageContent = lazy(() =>
  import('@/widgets/reset-password/ui/ResetPasswordPageContent').then(
    module => ({
      default: module.ResetPasswordPageContent,
    })
  )
);

// Скелетон для загрузки
const ResetPasswordSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <Skeleton variant="text" width="60%" height={40} className="mb-6" />
      <div className="space-y-4">
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </div>
    </div>
  </div>
);

const ResetPasswordPage: React.FC = () => (
  <Suspense fallback={<ResetPasswordSkeleton />}>
    <ResetPasswordPageContent />
  </Suspense>
);

export default ResetPasswordPage;
