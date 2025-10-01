'use client';

import React, { lazy, Suspense } from 'react';
import { CartSkeleton } from '@/shared/ui/skeletons/CartSkeleton';

// Ленивая загрузка контента
const CartContent = lazy(() => import('./CartContent'));

export const CartPageContent: React.FC = () => (
  <Suspense fallback={<CartSkeleton />}>
    <CartContent />
  </Suspense>
);
