'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы избранного
const FavoritePageContent = lazy(() =>
  import('@/widgets/favorite/ui/FavoritePageContent').then(module => ({
    default: module.FavoritePageContent,
  }))
);

// Скелетон для загрузки
const FavoriteSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={40} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={300} />
        ))}
      </div>
    </div>
  </div>
);

const FavoritePage: React.FC = () => (
  <Suspense fallback={<FavoriteSkeleton />}>
    <FavoritePageContent />
  </Suspense>
);

export default FavoritePage;
