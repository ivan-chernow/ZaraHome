'use client';

import React from 'react';
import ProductCard from '@/entities/product/ui/ProductCard';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { useGetFavoritesQuery } from '@/entities/favorite/api/favorites.api';
import { useGetCatalogQuery } from '@/entities/product/api/products.api';
import { getAllProducts } from '@/entities/category/lib/catalog.utils';
import { ProductCardSkeleton } from '@/entities/product/ui/ProductCardSceleton';
import { getLocalStorage } from '@/shared/lib/storage';
import { setFavorites } from '@/entities/favorite/model/favorites.slice';

export const FavoritePageContent: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const rawUserId = useSelector((state: RootState) => state.auth.user?.id);
  const userId = rawUserId != null ? Number(rawUserId) : undefined;

  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);

  // Поднимаем локальные избранные на случай, если Redux пуст (например, сразу после F5)
  React.useEffect(() => {
    const key = isAuthenticated && userId ? `favorites:${userId}` : 'favorites';
    const fromStorage: number[] = getLocalStorage(key, []);
    if (Array.isArray(fromStorage) && fromStorage.length > 0) {
      const differs =
        fromStorage.length !== favoriteIds.length ||
        fromStorage.some(id => !favoriteIds.includes(id));
      if (differs) dispatch(setFavorites(fromStorage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);

  // Каталог — нужен для мгновенного отображения по локальным id
  const { data: categories, isLoading: loadingCatalog } = useGetCatalogQuery();

  // Избранные с сервера (для авторизованных)
  const {
    data: serverFavorites = [],
    isLoading: loadingServer,
    isFetching: fetchingServer,
  } = useGetFavoritesQuery(isAuthenticated ? userId : undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Map local ids -> products по каталогу (для мгновенного рендера)
  const localMapped = React.useMemo(() => {
    if (!categories || favoriteIds.length === 0) return [] as any[];
    const allProducts = getAllProducts(categories);
    return allProducts.filter(p => favoriteIds.includes(p.id));
  }, [categories, favoriteIds]);

  // Формируем итоговый список: приоритет — сервер (если уже пришёл), объединяя с локальным
  const favoriteProducts = React.useMemo(() => {
    const byId = new Map<number, any>();

    // локальные мгновенно
    for (const p of localMapped) {
      byId.set(p.id, p);
    }

    // серверные (перекрывают локальные при совпадении id)
    if (Array.isArray(serverFavorites)) {
      for (const p of serverFavorites as any[]) {
        byId.set(p.id, p);
      }
    }

    return Array.from(byId.values());
  }, [localMapped, serverFavorites]);

  // Состояние загрузки: показываем скелетоны, если ничего отобразить и ещё ждём данные
  const isLoading = (() => {
    // Если уже есть что показать (локальное или серверное) — не считаем загрузкой
    if (favoriteProducts.length > 0) return false;

    // Если есть локальные ids, но каталог не подгружен — ждём (скелетоны)
    if (favoriteIds.length > 0 && loadingCatalog) return true;

    // Для авторизованных ждём сервер, если нет локальных данных
    if (isAuthenticated) return loadingServer || fetchingServer;

    // Для гостей — ждём только каталог, если нет ids
    return loadingCatalog;
  })();

  const renderContent = () => {
    if (isLoading) {
      return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 items-stretch">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ul>
      );
    }

    if (favoriteProducts && favoriteProducts.length > 0) {
      return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 items-stretch">
          {favoriteProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          У вас пока нет избранных товаров
        </h3>
        <p className="text-gray-400 mb-6">
          Добавляйте товары в избранное, чтобы вернуться к ним позже
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex items-center mb-[37px]">
        <h4 className="font-light text-[42px]">Избранные товары</h4>
        <div className="flex-1 h-[1px] bg-[#0000004D] ml-[5px]" />
      </div>
      {renderContent()}
    </div>
  );
};

export default FavoritePageContent;
