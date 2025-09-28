'use client';

import { lazy } from 'react';
import LazyPage from '../LazyPage';
import MainLayout from '@/widgets/layout/MainLayout';

// Ленивая загрузка тяжелого компонента заказов
const OrderPageContent = lazy(() =>
  import('@/widgets/order/ui/OrderPageContent').then(module => ({
    default: module.OrderPageContent,
  }))
);

/**
 * Ленивая загрузка страницы заказов
 */
const OrderPageLazy: React.FC = () => {
  return (
    <MainLayout>
      <LazyPage>
        <OrderPageContent />
      </LazyPage>
    </MainLayout>
  );
};

export default OrderPageLazy;
