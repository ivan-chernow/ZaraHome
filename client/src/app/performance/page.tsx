'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы производительности
const PerformanceReport = lazy(() => 
  import('@/shared/ui/PerformanceReport').then(module => ({ 
    default: module.default 
  }))
);

// Скелетон для загрузки
const PerformanceSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <Skeleton variant="text" width="50%" height={60} className="mx-auto mb-4" />
        <Skeleton variant="text" width="70%" height={30} className="mx-auto" />
      </div>
      <div className="space-y-6">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    </div>
  </div>
);

/**
 * Страница анализа производительности
 */
const PerformancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Анализ производительности
          </h1>
          <p className="text-lg text-gray-600">
            Анализ размера bundle и рекомендации по оптимизации
          </p>
        </div>

        <Suspense fallback={<PerformanceSkeleton />}>
          <PerformanceReport />
        </Suspense>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            🚀 Как использовать Bundle Analyzer
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>1. Запустите анализ:</strong>{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">
                npm run analyze
              </code>
            </p>
            <p>
              <strong>2. Откроется браузер</strong> с интерактивной картой
              bundle
            </p>
            <p>
              <strong>3. Изучите размеры файлов</strong> и найдите возможности
              для оптимизации
            </p>
            <p>
              <strong>4. Примените рекомендации</strong> для улучшения
              производительности
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
