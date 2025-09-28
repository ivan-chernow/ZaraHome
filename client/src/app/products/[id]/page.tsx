'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';

// Ленивая загрузка страницы товара
const ProductPageContent = lazy(() =>
  import('@/widgets/product/ui/ProductPageContent').then(module => ({
    default: module.ProductPageContent,
  }))
);

// Скелетон для загрузки
const ProductSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton variant="rectangular" width="100%" height={500} />
        <div className="space-y-4">
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>
      </div>
    </div>
  </div>
);

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => (
  <Suspense fallback={<ProductSkeleton />}>
    <ProductPageContent params={params} />
  </Suspense>
);

export default ProductPage;
