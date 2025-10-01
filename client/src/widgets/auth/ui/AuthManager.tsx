'use client';

import React from 'react';
import { useAuthSync } from '@/features/auth/hooks/useAuthSync';

/**
 * Компонент для управления авторизацией и синхронизацией данных
 * Использует хук useAuthSync для всей бизнес-логики
 */
export const AuthManager: React.FC = React.memo(() => {
  useAuthSync();
  return null;
});

AuthManager.displayName = 'AuthManager';