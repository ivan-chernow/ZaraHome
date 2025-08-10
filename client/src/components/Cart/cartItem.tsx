import React, { useCallback } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { CartItem as CartItemType } from "@/store/features/cart/cartItems.slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { findProductById } from "@/store/features/catalog/catalog.utils";
import {
  deleteCartItem,
  setCartItems,
} from "@/store/features/cart/cartItems.slice";
import { useRemoveFromCartMutation } from "@/api/cart.api";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

interface CartItemProps {
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

const CartItem = ({ item, isLast }: CartItemProps) => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.catalog.categories
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const product = findProductById(categories, item.id);
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleDelete = useCallback(async () => {
    // Оптимистично убираем из локального стора
    dispatch(deleteCartItem(item.id));

    if (isAuthenticated) {
      try {
        await removeFromCart(item.id).unwrap();
      } catch (e) {
        // В случае ошибки можно откатить при необходимости
        console.error("Ошибка удаления из корзины на сервере", e);
      }
      return;
    }

    // Гость: синхронизируем localStorage
    const cart = getLocalStorage("cart", [] as any[]);
    const updated = Array.isArray(cart)
      ? cart.filter((ci: any) => ci && ci.id !== item.id)
      : [];
    setLocalStorage("cart", updated);
    dispatch(setCartItems(updated));
  }, [dispatch, isAuthenticated, item.id, removeFromCart]);

  return (
    <li className="flex items-start py-4 w-full">
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
      <div className="flex flex-col flex-1 min-w-0">
        {product ? (
          <>
            <h4 className="font-bold text-[18px] leading-5 mb-[2px] truncate uppercase">
              {product.name_eng}
            </h4>
            <p className="font-medium text-[#00000080] text-[15px] leading-4 truncate">
              {product.name_ru}
            </p>
          </>
        ) : (
          <>
            <div className="h-4 w-56 bg-gray-200 animate-pulse rounded mb-1" />
            <div className="h-3 w-40 bg-gray-200 animate-pulse rounded" />
          </>
        )}
        <div className="mt-3 flex items-center">
          <span className="font-medium text-[20px] font-roboto">
            {(item.price * item.quantity).toLocaleString("ru-RU")}{" "}
            <span className="font-bold font-ysabeau text-[16px]">₽</span>
          </span>
        </div>
      </div>
      <button
        aria-label="Удалить товар"
        className="cursor-pointer ml-2 p-1 rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors duration-150 self-center transform hover:scale-105 active:scale-95"
        tabIndex={0}
        onClick={handleDelete}
      >
        <CloseIcon
          fontSize="small"
          className="hover:scale-105 active:scale-95"
        />
      </button>
      {!isLast && (
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#E5E5E5] w-full mt-4" />
      )}
    </li>
  );
};

export default CartItem;
