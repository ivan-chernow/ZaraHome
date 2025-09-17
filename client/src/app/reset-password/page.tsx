'use client';
import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { ResetPasswordPageContent } from '@/widgets/reset-password/ui/ResetPasswordPageContent';

const ResetPasswordPage: React.FC = () => (
  <MainLayout>
    <ResetPasswordPageContent />
  </MainLayout>
);

export default ResetPasswordPage;