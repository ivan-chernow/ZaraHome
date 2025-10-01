import { ProductPageContent } from '@/widgets/product/ui/ProductPageContent';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageContent params={params} />;
}
