'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы платежа
const PaymentPageContent = lazy(() =>
  import('@/widgets/payment/ui/PaymentPageContent').then(module => ({
    default: module.PaymentPageContent,
  }))
);

// Скелетон для загрузки
const PaymentSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={50} className="mb-6" />
      <div className="space-y-6">
        <Skeleton variant="rectangular" width="100%" height={300} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    </div>
  </div>
);

const PaymentPage: React.FC = () => (
  <Suspense fallback={<PaymentSkeleton />}>
    <PaymentPageContent />
  </Suspense>
);

export default PaymentPage;
