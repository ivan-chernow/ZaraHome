'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы информации
const InfoPageContent = lazy(() =>
  import('@/widgets/info/ui/InfoPageContent').then(module => ({
    default: module.InfoPageContent,
  }))
);

// Скелетон для загрузки
const InfoSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="40%" height={50} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="text" width="100%" height={20} />
        ))}
      </div>
    </div>
  </div>
);

const InfoPage: React.FC = () => (
  <Suspense fallback={<InfoSkeleton />}>
    <InfoPageContent />
  </Suspense>
);

export default InfoPage;
