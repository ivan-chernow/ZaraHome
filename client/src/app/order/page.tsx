'use client';
import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { OrderPageContent } from '@/widgets/order/ui/OrderPageContent';

const OrderPage: React.FC = () => (
  <MainLayout>
    <OrderPageContent />
  </MainLayout>
);

export default OrderPage;
