'use client';

import React, { Suspense } from 'react';
import { HomeSkeleton } from '@/shared/ui/skeletons/HomeSkeleton';
import HomeContent from './HomeContent';

const HomePageWidget: React.FC = () => {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
};

export { HomePageWidget };
