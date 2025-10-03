import { ProductPageWidget } from '@/widgets/product/ui/ProductPageWidget';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageWidget params={params} />;
}
