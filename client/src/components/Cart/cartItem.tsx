import React from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { CartItem as CartItemType } from "@/store/features/cart/cartItems.slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { findProductById } from "@/store/features/catalog/catalog.utils";
import { deleteCartItem } from "@/store/features/cart/cartItems.slice";

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
  const product = findProductById(categories, item.id);

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
        <h4 className="font-bold text-[18px] leading-5 mb-[2px] truncate uppercase">
          {product?.name_eng || `Товар #${item.id}`}
        </h4>
        <p className="font-medium text-[#00000080] text-[15px] leading-4 truncate">
          {product?.name_ru || `id: ${item.id}`}
        </p>
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
        onClick={() => dispatch(deleteCartItem(item.id))}
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
