'use client';

import React, { Suspense } from 'react';
import { Skeleton } from '@mui/material';

interface LazyPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Компонент для ленивой загрузки страниц с fallback
 */
const LazyPage: React.FC<LazyPageProps> = React.memo(
  ({ children, fallback = <PageSkeleton /> }) => {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }
);

/**
 * Скелетон для загрузки страниц
 */
const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Skeleton variant="rectangular" width={120} height={32} />
          <div className="flex space-x-4">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={300} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

LazyPage.displayName = 'LazyPage';

export default LazyPage;
