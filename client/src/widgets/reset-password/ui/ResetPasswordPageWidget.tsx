'use client';

import React, { Suspense } from 'react';
import { ResetPasswordSkeleton } from '@/shared/ui/skeletons/ResetPasswordSkeleton';
import { ResetPasswordPageContent } from './ResetPasswordPageContent';

export const ResetPasswordPageWidget: React.FC = () => {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
};

export default ResetPasswordPageWidget;
