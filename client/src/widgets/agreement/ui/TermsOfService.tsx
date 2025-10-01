'use client';

import React, { lazy, Suspense } from 'react';
import { AgreementSkeleton } from '@/shared/ui/skeletons/AgreementSkeleton';

// Ленивая загрузка контента
const TermsOfServiceContent = lazy(() => import('./TermsOfServiceContent'));

export const TermsOfService: React.FC = () => (
  <Suspense fallback={<AgreementSkeleton />}>
    <TermsOfServiceContent />
  </Suspense>
);
