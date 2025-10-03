'use client';

import React, { Suspense } from 'react';
import { SubCategorySkeleton } from '@/shared/ui/skeletons/SubCategorySkeleton';
import { SubCategoryPageContent } from './SubCategoryPageContent';

interface SubCategoryPageWidgetProps {
  params: Promise<{ category: string; subCategory: string }>;
}

export const SubCategoryPageWidget: React.FC<SubCategoryPageWidgetProps> = ({
  params,
}) => {
  return (
    <Suspense fallback={<SubCategorySkeleton />}>
      <SubCategoryPageContent params={params} />
    </Suspense>
  );
};

export default SubCategoryPageWidget;
