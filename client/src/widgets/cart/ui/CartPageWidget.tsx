'use client';

import React, { lazy, Suspense } from 'react';
import { CartSkeleton } from '@/shared/ui/skeletons/CartSkeleton';

// Ленивая загрузка контента
const CartContent = lazy(() => import('./CartContent'));

export const CartPageWidget: React.FC = () => (
  <Suspense fallback={<CartSkeleton />}>
    <CartContent />
  </Suspense>
);

export default CartPageWidget;
