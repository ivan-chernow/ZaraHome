'use client';

import React from 'react';
import { AdminPage } from '@/features/admin/ui/AdminPage';

/**
 * Упрощенный виджет админ-панели
 * Простая композиция без избыточной декомпозиции
 */
export const AdminPageWidget: React.FC = () => {
  return <AdminPage />;
};

export default AdminPageWidget;
