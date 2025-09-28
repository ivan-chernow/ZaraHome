'use client';
import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { AdminPageContent } from '@/widgets/admin/ui/AdminPageContent';

const AdminPage: React.FC = () => (
  <MainLayout>
    <AdminPageContent />
  </MainLayout>
);

export default AdminPage;
