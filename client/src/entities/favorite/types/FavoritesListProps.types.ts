import { Product } from '@/entities/product/api/product.types';

export interface FavoritesListProps {
  products: Product[];
  isLoading: boolean;
  skeletonCount?: number;
}
