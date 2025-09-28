'use client';

import React from 'react';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/shared/config/store/store';
import { findProductById } from '@/entities/category/lib/catalog.utils';
import type { Product } from '@/entities/product/api/products.api';
import {
  addCartItem,
  removeCartItem,
  deleteCartItem,
  setCartItemQuantity,
  type CartItem as CartItemType,
} from '@/entities/cart/model/cartItems.slice';
import { useState, useCallback, useEffect } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { useRemoveFromCartMutation } from '@/entities/cart/api/cart.api';

interface CartPageItemProps {
  item: CartItemType;
  isLast?: boolean;
  product?: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getFullImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  try {
    const cleanPath = path.replace(/^\/+/, '');
    return `${API_URL}/${cleanPath}`;
  } catch {
    return path;
  }
};

const CartPageItem: React.FC<CartPageItemProps> = ({
  item,
  product: productProp,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>(String(item.quantity));
  const categories = useSelector(
    (state: RootState) => state.catalog.categories
  );
  const productStore = findProductById(categories, item.id);
  const product = productProp ?? productStore;
  const [removeFromCart] = useRemoveFromCartMutation();

  // Синхронизируем инпут с количеством из стора (после +/− или внешних изменений)
  useEffect(() => {
    setInputValue(String(item.quantity));
  }, [item.quantity]);

  const handleDecrease = () =>
    dispatch(
      removeCartItem({ id: item.id, size: item.size, color: item.color })
    );
  const handleIncrease = () =>
    dispatch(
      addCartItem({
        id: item.id,
        price: item.price,
        img: item.img,
        size: item.size,
        color: item.color,
      })
    );
  const handleDelete = async () => {
    dispatch(
      deleteCartItem({ id: item.id, size: item.size, color: item.color })
    );
    try {
      await removeFromCart(item.id).unwrap();
    } catch (error) {
      // Можно откатить, если нужно: dispatch(addCartItem({ ...item }));
      console.error('Ошибка удаления из корзины на сервере', error);
    }
  };

  const commitInput = useCallback(() => {
    const numeric = parseInt(inputValue, 10);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setInputValue(String(item.quantity));
      return;
    }
    dispatch(
      setCartItemQuantity({
        id: item.id,
        quantity: numeric,
        size: item.size,
        color: item.color,
      })
    );
    setInputValue(String(numeric));
  }, [dispatch, inputValue, item.id, item.quantity, item.color, item.size]);

  return (
    <li className="flex items-center justify-between py-4">
      {/* Left: image + titles */}
      <div className="flex items-center min-w-0 flex-1">
        <Image
          alt={product?.name_ru || `img-${item.id}`}
          src={
            getFullImageUrl(product?.img?.[0]) ||
            getFullImageUrl(item.img) ||
            '/assets/img/Catalog/product2.png'
          }
          width={79}
          height={79}
          className="mr-4 rounded object-cover"
        />
        <div className="flex flex-col min-w-0">
          {product ? (
            <>
              <h4 className="font-bold text-[14px] leading-4 mb-[2px] truncate uppercase">
                {product.name_eng}
              </h4>
              <p className="font-medium text-[#00000080] text-[12px] leading-4 truncate">
                {product.name_ru}
              </p>
              <div className="mt-1 text-[12px] text-[#00000099] flex gap-3 items-center">
                {item.size && (
                  <span>
                    Размер: {product?.size?.[item.size]?.size ?? item.size}
                  </span>
                )}
                {(() => {
                  const colorKeyRaw = (item.color ?? '').toString();
                  const colorKey = colorKeyRaw.trim();
                  const colorValue = product?.colors?.[colorKey] ?? colorKeyRaw;
                  if (!colorKey && !colorValue) return null;
                  const isWhite =
                    typeof colorValue === 'string' &&
                    /^(#fff(f{0,3})?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i.test(
                      colorValue
                    );
                  const isBlack =
                    typeof colorValue === 'string' &&
                    /^(#000(0{0,3})?|black|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))$/i.test(
                      colorValue
                    );
                  const colorLabel =
                    colorKey ||
                    (isWhite
                      ? 'белый'
                      : isBlack
                        ? 'черный'
                        : (colorValue || '').toString());
                  return (
                    <span className="flex items-center gap-1">
                      Цвет:
                      <span
                        className={`inline-block ${isWhite ? 'w-4 h-4' : 'w-3 h-3'} rounded-full border ${isWhite ? 'border-gray-400 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]' : ''}`}
                        style={{
                          backgroundColor: (colorValue as string) || undefined,
                        }}
                        aria-label={`Цвет ${colorLabel}`}
                      />
                      <span className="ml-1">{colorLabel}</span>
                    </span>
                  );
                })()}
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mb-1" />
              <div className="h-3 w-36 bg-gray-200 animate-pulse rounded" />
            </>
          )}
        </div>
      </div>

      {/* Middle: quantity controls */}
      <div className="flex items-center gap-3 mx-4">
        <button
          aria-label="Уменьшить количество"
          onClick={handleDecrease}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
        >
          <RemoveRoundedIcon fontSize="small" />
        </button>
        <input
          className="w-[56px] h-[36px] border border-[#E5E5E5] text-center text-[16px] rounded outline-none focus:border-gray-400"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={e => {
            const raw = e.target.value.replace(/\D+/g, '');
            setInputValue(raw);
            const numeric = parseInt(raw, 10);
            if (Number.isFinite(numeric) && numeric > 0) {
              dispatch(
                setCartItemQuantity({
                  id: item.id,
                  quantity: numeric,
                  size: item.size,
                  color: item.color,
                })
              );
            }
          }}
          onBlur={commitInput}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
        />
        <button
          aria-label="Увеличить количество"
          onClick={handleIncrease}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
        >
          <AddRoundedIcon fontSize="small" />
        </button>
      </div>

      {/* Right: price + delete */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-[16px] font-roboto whitespace-nowrap">
          {(item.price * item.quantity).toLocaleString('ru-RU')}{' '}
          <span className="font-bold font-ysabeau text-[14px]">₽</span>
        </span>
        <button
          aria-label="Удалить товар"
          className="ml-1 p-1 rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors duration-150 transform hover:scale-105 active:scale-95 cursor-pointer"
          onClick={handleDelete}
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    </li>
  );
};

export default CartPageItem;
