'use client';

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { PaymentPageContent } from '@/widgets/payment/ui/PaymentPageContent';

const PaymentPage: React.FC = () => (
  <MainLayout>
    <PaymentPageContent />
  </MainLayout>
);

export default PaymentPage;