"use client";

import React from "react";
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
} from "@/store/features/favorites/favorites.slice";

interface FavoriteButtonProps {
  productId: number;
}

const FavoriteButton = ({ productId }: FavoriteButtonProps) => {
  const dispatch = useDispatch();
  const { ids: favoriteIds } = useSelector(
    (state: RootState) => state.favorites
  );
  const isFavorite = favoriteIds.includes(productId);

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthenticated) {
      if (isFavorite) {
        await removeFromFavorites(productId);
        dispatch(removeFavorite(productId));
      } else {
        await addToFavorites(productId);
        dispatch(setFavorites(favorites));
      }
    } else {
      let favorites: number[];
      try {
        favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      } catch {
        favorites = [];
      }
      if (favorites.includes(productId)) {
        favorites = favorites.filter((id) => id !== productId);
      } else {
        favorites.push(productId);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      dispatch(setFavorites(favorites));
    }
  };

  return (
    <div
      onClick={handleToggleFavorite}
      className={`        bg-black
        cursor-pointer
        transition-colors
        duration-300
        w-[56px] h-[56px]
        flex items-center justify-center
        ${isFavorite ? "bg-red-500" : "hover:bg-red-400"}
      `}
    >
      <Image
        src="/assets/img/New%20Clothes/favorite.svg"
        alt="favorites"
        width={22}
        height={20}
      />
    </div>
  );
};

export default FavoriteButton;
