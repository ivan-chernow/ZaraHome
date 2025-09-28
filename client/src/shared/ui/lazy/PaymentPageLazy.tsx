'use client';

import { lazy } from 'react';
import LazyPage from '../LazyPage';
import MainLayout from '@/widgets/layout/MainLayout';

// Ленивая загрузка тяжелого компонента оплаты
const PaymentPageContent = lazy(() =>
  import('@/widgets/payment/ui/PaymentPageContent').then(module => ({
    default: module.PaymentPageContent,
  }))
);

/**
 * Ленивая загрузка страницы оплаты
 */
const PaymentPageLazy: React.FC = () => {
  return (
    <MainLayout>
      <LazyPage>
        <PaymentPageContent />
      </LazyPage>
    </MainLayout>
  );
};

export default PaymentPageLazy;
