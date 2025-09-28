'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка главной страницы
const App = lazy(() =>
  import('@/widgets/home/ui/App').then(module => ({ default: module.App }))
);

// Скелетон для загрузки
const HomeSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
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

const Home: React.FC = () => (
  <Suspense fallback={<HomeSkeleton />}>
    <App />
  </Suspense>
);

export default Home;
