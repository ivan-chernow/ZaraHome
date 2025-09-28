'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы заказа
const OrderPageContent = lazy(() => 
  import('@/widgets/order/ui/OrderPageContent').then(module => ({ 
    default: module.OrderPageContent 
  }))
);

// Скелетон для загрузки
const OrderSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={50} className="mb-6" />
      <div className="space-y-6">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={150} />
        <Skeleton variant="rectangular" width="100%" height={100} />
      </div>
    </div>
  </div>
);

const OrderPage: React.FC = () => (
  <Suspense fallback={<OrderSkeleton />}>
    <OrderPageContent />
  </Suspense>
);

export default OrderPage;
