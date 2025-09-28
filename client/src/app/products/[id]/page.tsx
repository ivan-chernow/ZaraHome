'use client';
import React from 'react';
import { ProductPageContent } from '@/widgets/product/ui/ProductPageContent';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => (
  <ProductPageContent params={params} />
);

export default ProductPage;
