'use client';

import React, { Suspense } from 'react';
import { PaymentSkeleton } from '@/shared/ui/skeletons/PaymentSkeleton';
import { PaymentPageContent } from './PaymentPageContent';

export const PaymentPageWidget: React.FC = () => {
  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  );
};

export default PaymentPageWidget;
