'use client';
import React from 'react';
import ProductPageLazy from '@/shared/ui/lazy/ProductPageLazy';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => (
  <ProductPageLazy params={params} />
);

export default ProductPage;
