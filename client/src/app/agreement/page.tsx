'use client';

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { TermsOfService } from '@/widgets/agreement/ui/TermsOfService';

const TermsOfServicePage: React.FC = () => (
  <MainLayout>
    <TermsOfService />
  </MainLayout>
);

export default TermsOfServicePage;
