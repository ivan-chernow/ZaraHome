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
  addFavorite,
  removeFavorite,
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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      await removeFromFavorites(productId);
      dispatch(removeFavorite(productId));
    } else {
      await addToFavorites(productId);
      dispatch(addFavorite(productId));
    }
  };

  return (
    <div
      onClick={handleToggleFavorite}
      className={`
        bg-black
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
