'use client';

import React, { lazy, Suspense } from 'react';
import { HomeSkeleton } from '@/shared/ui/skeletons/HomeSkeleton';

// Ленивая загрузка контента
const HomeContent = lazy(() => import('./HomeContent'));

export const HomePageWidget: React.FC = () => (
  <Suspense fallback={<HomeSkeleton />}>
    <HomeContent />
  </Suspense>
);
