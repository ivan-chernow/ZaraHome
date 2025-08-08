"use client";

import React from "react";
import MainLayout from "@/layout/MainLayout";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useGetFavoritesQuery } from "@/api/favorites.api";
import { useGetCatalogQuery } from "@/api/products.api";
import { getAllProducts } from "@/store/features/catalog/catalog.utils";
import { ProductCardSkeleton } from "@/components/ProductCardSceleton";
import { getLocalStorage } from "@/utils/storage";
import { setFavorites } from "@/store/features/favorites/favorites.slice";

const Page = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const rawUserId = useSelector((state: RootState) => state.auth.user?.id);
  const userId = rawUserId != null ? Number(rawUserId) : undefined;

  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);

  const [hasMounted, setHasMounted] = React.useState(false);
  const [favoritesReady, setFavoritesReady] = React.useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Guest: sync from localStorage once
  React.useEffect(() => {
    if (!isAuthenticated) {
      const fromStorage: number[] = getLocalStorage("favorites", []);
      if (Array.isArray(fromStorage)) {
        const differs =
          fromStorage.length !== favoriteIds.length ||
          fromStorage.some((id) => !favoriteIds.includes(id));
        if (differs) dispatch(setFavorites(fromStorage));
      }
      setFavoritesReady(true);
      return;
    }
    setFavoritesReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Catalog (needed only for guest mapping by IDs)
  const { data: categories, isLoading: loadingCatalog } = useGetCatalogQuery();

  // Server favorites for authenticated
  const {
    data: serverFavorites = [],
    isLoading: loadingServer,
    isFetching: fetchingServer,
    isError: isErrorServer,
    error: errorServer,
    isSuccess: successServer,
  } = useGetFavoritesQuery(isAuthenticated ? userId : undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Sync Redux favoriteIds with server for proper button states (only on success and when not fetching)
  React.useEffect(() => {
    if (!isAuthenticated) return;
    if (!successServer) return;
    if (fetchingServer) return;
    const serverIds = Array.isArray(serverFavorites)
      ? (serverFavorites as any[]).map((p) => p.id)
      : [];
    const a = [...favoriteIds].sort((x, y) => x - y);
    const b = [...serverIds].sort((x, y) => x - y);
    const equal = a.length === b.length && a.every((v, i) => v === b[i]);
    if (!equal) dispatch(setFavorites(serverIds));
  }, [
    isAuthenticated,
    successServer,
    fetchingServer,
    serverFavorites,
    favoriteIds,
    dispatch,
  ]);

  // Guest mapping by IDs
  const guestFavorites = React.useMemo(() => {
    if (isAuthenticated || !categories || favoriteIds.length === 0) return [];
    const allProducts = getAllProducts(categories);
    return allProducts.filter((product) => favoriteIds.includes(product.id));
  }, [isAuthenticated, categories, favoriteIds]);

  // Auth mapping by IDs (for instant UI updates) and merging with server
  const authMappedFavorites = React.useMemo(() => {
    if (!isAuthenticated || !categories || favoriteIds.length === 0) return [];
    const allProducts = getAllProducts(categories);
    return allProducts.filter((product) => favoriteIds.includes(product.id));
  }, [isAuthenticated, categories, favoriteIds]);

  // Decide products
  const favoriteProducts = React.useMemo(() => {
    if (isAuthenticated) {
      // Merge server favorites with mapped by IDs for instant updates
      const byId = new Map<number, any>();
      // Always respect current favoriteIds
      const idsSet = new Set(favoriteIds);
      if (Array.isArray(serverFavorites)) {
        for (const p of serverFavorites as any[]) {
          if (idsSet.has(p.id)) byId.set(p.id, p);
        }
      }
      for (const p of authMappedFavorites) {
        if (idsSet.has(p.id) && !byId.has(p.id)) byId.set(p.id, p);
      }
      return Array.from(byId.values());
    }
    return guestFavorites;
  }, [
    isAuthenticated,
    serverFavorites,
    authMappedFavorites,
    guestFavorites,
    favoriteIds,
  ]);

  // Mark initial load complete
  React.useEffect(() => {
    if (!hasMounted || !favoritesReady) return;

    if (isAuthenticated) {
      // consider initial done when first load finished (either success or error), but don't block on refetch
      if (!loadingServer && !fetchingServer) setInitialLoadComplete(true);
      return;
    }

    // guest needs catalog
    if (categories && !loadingCatalog) setInitialLoadComplete(true);
  }, [
    hasMounted,
    favoritesReady,
    isAuthenticated,
    loadingServer,
    fetchingServer,
    categories,
    loadingCatalog,
  ]);

  // Loading state
  const isLoading = (() => {
    if (!hasMounted || !favoritesReady || !initialLoadComplete) return true;
    if (isAuthenticated)
      return loadingServer && !successServer && serverFavorites.length === 0;
    return loadingCatalog || !categories;
  })();

  // Show error only when truly failed and not refetching, and have nothing to show
  const shouldShowError = Boolean(
    isAuthenticated &&
      isErrorServer &&
      !fetchingServer &&
      serverFavorites.length === 0 &&
      initialLoadComplete
  );

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

    // Do not show blocking error UI; log and continue to graceful empty state
    if (shouldShowError) {
      console.error("Favorites error:", errorServer);
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
    <MainLayout>
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex items-center mb-[37px]">
          <h4 className="font-light text-[42px]">Избранные товары</h4>
          <div className="flex-1 h-[1px] bg-[#0000004D] ml-[5px]" />
        </div>
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default Page;
