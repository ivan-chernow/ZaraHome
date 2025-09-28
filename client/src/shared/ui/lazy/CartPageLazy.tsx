'use client';

import { lazy } from 'react';
import LazyPage from '../LazyPage';
import MainLayout from '@/widgets/layout/MainLayout';

// Ленивая загрузка тяжелого компонента корзины
const CartPageContent = lazy(() =>
  import('@/widgets/cart/ui/CartPageContent').then(module => ({
    default: module.CartPageContent,
  }))
);

/**
 * Ленивая загрузка страницы корзины
 */
const CartPageLazy: React.FC = () => {
  return (
    <MainLayout>
      <LazyPage>
        <CartPageContent />
      </LazyPage>
    </MainLayout>
  );
};

export default CartPageLazy;
