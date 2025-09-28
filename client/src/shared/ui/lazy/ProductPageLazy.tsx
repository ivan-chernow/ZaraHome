'use client';

import { lazy } from 'react';
import LazyPage from '../LazyPage';

// Ленивая загрузка тяжелого компонента страницы товара
const ProductPageContent = lazy(() => 
  import('@/widgets/product/ui/ProductPageContent').then(module => ({
    default: module.ProductPageContent
  }))
);

interface ProductPageLazyProps {
  params: Promise<{ id: string }>;
}

/**
 * Ленивая загрузка страницы товара
 */
const ProductPageLazy: React.FC<ProductPageLazyProps> = ({ params }) => {
  return (
    <LazyPage>
      <ProductPageContent params={params} />
    </LazyPage>
  );
};

export default ProductPageLazy;
