'use client';

import React, { Suspense } from 'react';
import { ReviewsSkeleton } from '@/shared/ui/skeletons/ReviewsSkeleton';
import { ReviewsPageContent } from './ReviewsPageContent';

export const ReviewsPageWidget: React.FC = () => {
  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <ReviewsPageContent />
    </Suspense>
  );
};

export default ReviewsPageWidget;
