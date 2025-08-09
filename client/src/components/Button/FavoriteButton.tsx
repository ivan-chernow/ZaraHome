"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@/api/favorites.api";
import {
  removeFavorite,
  setFavorites,
  addFavorite,
} from "@/store/features/favorites/favorites.slice";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  size?: "small" | "medium" | "large";
}

// Константы для размеров
const SIZE_CONFIG = {
  small: { button: "w-8 h-8", icon: 16 },
  medium: { button: "w-10 h-10", icon: 18 },
  large: { button: "w-14 h-14", icon: 22 },
} as const;

// Хук для работы с избранным
const useFavorites = (productId: number) => {
  const dispatch = useDispatch();
  const { ids: favoriteIds } = useSelector(
    (state: RootState) => state.favorites
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const isFavorite = useMemo(
    () => favoriteIds.includes(productId),
    [favoriteIds, productId]
  );

  const handleAuthenticatedToggle = useCallback(async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(productId).unwrap();
        dispatch(removeFavorite(productId));
        // Синхронизируем локально для мгновенного восстановления после перезагрузки
        const key = userId ? `favorites:${userId}` : "favorites";
        const favorites = getLocalStorage(key, []);
        const updated = Array.isArray(favorites)
          ? favorites.filter((id: number) => id !== productId)
          : [];
        setLocalStorage(key, updated);
      } else {
        await addToFavorites(productId).unwrap();
        dispatch(addFavorite(productId));
        const key = userId ? `favorites:${userId}` : "favorites";
        const favorites = getLocalStorage(key, []);
        const updated = Array.isArray(favorites)
          ? Array.from(new Set([...(favorites as number[]), productId]))
          : [productId];
        setLocalStorage(key, updated);
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  }, [
    isFavorite,
    productId,
    addToFavorites,
    removeFromFavorites,
    dispatch,
    userId,
  ]);

  const handleGuestToggle = useCallback(() => {
    const favorites = getLocalStorage("favorites", []);
    const updatedFavorites = isFavorite
      ? favorites.filter((id: number) => id !== productId)
      : [...favorites, productId];

    setLocalStorage("favorites", updatedFavorites);
    dispatch(setFavorites(updatedFavorites));
  }, [isFavorite, productId, dispatch]);

  return {
    isFavorite,
    isAuthenticated,
    handleToggle: isAuthenticated
      ? handleAuthenticatedToggle
      : handleGuestToggle,
  };
};

// Компонент иконки избранного
const FavoriteIcon: React.FC<{ size: number }> = React.memo(({ size }) => (
  <Image
    src="/assets/img/New%20Clothes/favorite.svg"
    alt="Добавить в избранное"
    width={size}
    height={size}
    className="transition-transform duration-200 hover:scale-110"
  />
));

FavoriteIcon.displayName = "FavoriteIcon";

const FavoriteButton: React.FC<FavoriteButtonProps> = React.memo(
  ({ productId, className = "", size = "large" }) => {
    const { isFavorite, handleToggle } = useFavorites(productId);

    const sizeConfig = useMemo(() => SIZE_CONFIG[size], [size]);

    const buttonClasses = useMemo(() => {
      const baseClasses = [
        "cursor-pointer",
        "transition-all",
        "duration-300",
        "flex",
        "items-center",
        "justify-center",
        "rounded-lg",
        "border-2",
        "border-transparent",
        "active:scale-95",
        sizeConfig.button,
        className,
      ];

      const stateClasses = isFavorite
        ? ["bg-red-500", "hover:bg-red-600", "text-white"]
        : ["bg-black", "hover:bg-black/80", "text-white"]; // тёмный фон вместо светлого

      return [...baseClasses, ...stateClasses].join(" ");
    }, [isFavorite, sizeConfig.button, className]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      },
      [handleToggle]
    );

    return (
      <button
        onClick={handleClick}
        className={buttonClasses}
        aria-label={
          isFavorite ? "Удалить из избранного" : "Добавить в избранное"
        }
        title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <FavoriteIcon size={sizeConfig.icon} />
      </button>
    );
  }
);

FavoriteButton.displayName = "FavoriteButton";

export default FavoriteButton;
