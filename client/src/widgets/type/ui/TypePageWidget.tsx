'use client';

import React, { Suspense } from 'react';
import { TypeSkeleton } from '@/shared/ui/skeletons/TypeSkeleton';
import { TypePageContent } from './TypePageContent';

interface TypePageWidgetProps {
  params: Promise<{ category: string; subCategory: string; type: string }>;
}

export const TypePageWidget: React.FC<TypePageWidgetProps> = ({ params }) => {
  return (
    <Suspense fallback={<TypeSkeleton />}>
      <TypePageContent params={params} />
    </Suspense>
  );
};

export default TypePageWidget;
