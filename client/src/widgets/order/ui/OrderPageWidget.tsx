'use client';

import React, { Suspense } from 'react';
import { OrderSkeleton } from '@/shared/ui/skeletons/OrderSkeleton';
import { OrderPageContent } from './OrderPageContent';

export const OrderPageWidget: React.FC = () => {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderPageContent />
    </Suspense>
  );
};

export default OrderPageWidget;
