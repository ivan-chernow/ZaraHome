"use client";

import React from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { findProductById } from "@/store/features/catalog/catalog.utils";
import {
  addCartItem,
  removeCartItem,
  deleteCartItem,
  type CartItem as CartItemType,
} from "@/store/features/cart/cartItems.slice";

interface CartPageItemProps {
  item: CartItemType;
  isLast?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getFullImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  try {
    const cleanPath = path.replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  } catch {
    return path;
  }
};

const CartPageItem: React.FC<CartPageItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.catalog.categories
  );
  const product = findProductById(categories, item.id);

  const handleDecrease = () => dispatch(removeCartItem(item.id));
  const handleIncrease = () =>
    dispatch(addCartItem({ id: item.id, price: item.price, img: item.img }));
  const handleDelete = () => dispatch(deleteCartItem(item.id));

  return (
    <li className="flex items-center justify-between py-4">
      {/* Left: image + titles */}
      <div className="flex items-center min-w-0 flex-1">
        <Image
          alt={product?.name_ru || `img-${item.id}`}
          src={
            getFullImageUrl(product?.img?.[0]) ||
            getFullImageUrl(item.img) ||
            "/assets/img/Catalog/product2.png"
          }
          width={79}
          height={79}
          className="mr-4 rounded object-cover"
        />
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-[14px] leading-4 mb-[2px] truncate uppercase">
            {product?.name_eng || `Товар #${item.id}`}
          </h4>
          <p className="font-medium text-[#00000080] text-[12px] leading-4 truncate">
            {product?.name_ru || `id: ${item.id}`}
          </p>
        </div>
      </div>

      {/* Middle: quantity controls */}
      <div className="flex items-center gap-3 mx-4">
        <button
          aria-label="Уменьшить количество"
          onClick={handleDecrease}
          className="text-[#6B7280] hover:text-black transition transform hover:scale-105 active:scale-95"
        >
          −
        </button>
        <div className="w-[36px] h-[28px] border border-[#E5E5E5] text-center leading-[28px] text-[14px]">
          {item.quantity}
        </div>
        <button
          aria-label="Увеличить количество"
          onClick={handleIncrease}
          className="text-[#6B7280] hover:text-black transition transform hover:scale-105 active:scale-95"
        >
          +
        </button>
      </div>

      {/* Right: price + delete */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-[16px] font-roboto whitespace-nowrap">
          {(item.price * item.quantity).toLocaleString("ru-RU")}{" "}
          <span className="font-bold font-ysabeau text-[14px]">₽</span>
        </span>
        <button
          aria-label="Удалить товар"
          className="ml-1 p-1 rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors duration-150 transform hover:scale-105 active:scale-95"
          onClick={handleDelete}
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    </li>
  );
};

export default CartPageItem;
