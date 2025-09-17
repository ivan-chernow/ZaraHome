'use client';

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { ReviewsPageContent } from '@/widgets/reviews/ui/ReviewsPageContent';

const ReviewsPage: React.FC = () => (
  <MainLayout>
    <ReviewsPageContent />
  </MainLayout>
);

export default ReviewsPage;