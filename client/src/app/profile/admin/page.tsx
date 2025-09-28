'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка админ страницы
const AdminPageContent = lazy(() => 
  import('@/widgets/admin/ui/AdminPageContent').then(module => ({ 
    default: module.AdminPageContent 
  }))
);

// Скелетон для загрузки
const AdminSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={50} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={200} />
        ))}
      </div>
    </div>
  </div>
);

const AdminPage: React.FC = () => (
  <Suspense fallback={<AdminSkeleton />}>
    <AdminPageContent />
  </Suspense>
);

export default AdminPage;
