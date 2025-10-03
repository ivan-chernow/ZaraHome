import { Product } from '@/entities/product/api/product.types';

export interface FavoriteSyncResult {
  /** Список избранных товаров */
  favoriteProducts: Product[];
  /** Состояние загрузки */
  isLoading: boolean;
  /** Статус авторизации пользователя */
  isAuthenticated: boolean;
  /** ID пользователя */
  userId?: number;
  /** Нужно ли показывать список (товары или скелетоны) */
  shouldShowList: boolean;
}
export interface FavoriteDataSyncResult {
  favoriteProducts: Product[];
  isLoading: boolean;
}
