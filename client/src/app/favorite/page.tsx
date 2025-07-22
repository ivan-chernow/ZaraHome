"use client";

import React from "react";
import MainLayout from "@/layout/MainLayout";
import ProductCard from "@/components/ProductCard";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  useGetFavoritesQuery,
  useGetProductsByIdsQuery,
} from "@/api/favorites.api";

const Page = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);

  // Вызовы хуков только когда нужно
  const {
    data: serverFavorites = [],
    isLoading: loadingServer,
    error: errorServer,
  } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated });
  const {
    data: guestFavorites = [],
    isLoading: loadingGuest,
    error: errorGuest,
  } = useGetProductsByIdsQuery(favoriteIds, {
    skip: isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  let favoriteProducts = [];
  let isLoading = false;
  let error = null;

  if (isAuthenticated) {
    favoriteProducts = serverFavorites;
    isLoading = loadingServer;
    error = errorServer;
  } else {
    favoriteProducts = guestFavorites;
    isLoading = loadingGuest;
    error = errorGuest;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Ошибка при загрузке избранных товаров.</p>
        </div>
      );
    }

    if (favoriteProducts && favoriteProducts.length > 0) {
      return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
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
