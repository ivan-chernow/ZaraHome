'use client';

import React, { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import {
  addCartItem,
  removeCartItem,
  deleteCartItem,
  setCartItemQuantity,
  type CartItem as CartItemType,
} from '@/entities/cart/model/cartItems.slice';
import { findProductById } from '@/entities/category/lib/catalog.utils';
import type { Product } from '@/entities/product/api/products.api';
import { useFirstImageUrl } from '@/shared/lib/hooks/useImage';
import HorizontalLine from '@/shared/ui/HorizontalLine';

interface CartItemGroupProps {
  productId: number;
  variants: CartItemType[];
  product?: Product;
  categories: any[];
  isLast: boolean;
}

const CartItemGroup = memo<CartItemGroupProps>(function CartItemGroup({
  productId,
  variants,
  product,
  categories,
  isLast,
}) {
  const dispatch = useDispatch();

  // Мемоизированный поиск продукта
  const productStore = useMemo(
    () => findProductById(categories, productId),
    [categories, productId]
  );

  const finalProduct = product ?? productStore;

  // Оптимизированное получение URL изображения
  const imageUrl = useFirstImageUrl(finalProduct?.img, variants[0]?.img);

  // Мемоизированные вычисления
  const totalForProduct = useMemo(
    () => variants.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [variants]
  );

  const totalQty = useMemo(
    () => variants.reduce((sum, item) => sum + item.quantity, 0),
    [variants]
  );

  // Мемоизированные обработчики
  const handleDec = useCallback(
    (item: CartItemType) =>
      dispatch(
        removeCartItem({ id: item.id, size: item.size, color: item.color })
      ),
    [dispatch]
  );

  const handleInc = useCallback(
    (item: CartItemType) =>
      dispatch(
        addCartItem({
          id: item.id,
          price: item.price,
          img: item.img,
          size: item.size,
          color: item.color,
        })
      ),
    [dispatch]
  );

  const handleDel = useCallback(
    (item: CartItemType) =>
      dispatch(
        deleteCartItem({ id: item.id, size: item.size, color: item.color })
      ),
    [dispatch]
  );

  const handleSetQty = useCallback(
    (item: CartItemType, qty: number) =>
      dispatch(
        setCartItemQuantity({
          id: item.id,
          quantity: qty,
          size: item.size,
          color: item.color,
        })
      ),
    [dispatch]
  );

  return (
    <React.Fragment>
      <HorizontalLine width="720px" />
      <li className="flex flex-col py-4">
        <div className="flex items-start min-w-0 justify-between">
          <div className="flex items-center min-w-0">
            <Image
              alt={finalProduct?.name_ru || `Товар ${productId}`}
              src={imageUrl}
              width={79}
              height={79}
              className="mr-4 rounded object-cover"
            />
            <div className="flex flex-col min-w-0">
              {finalProduct ? (
                <>
                  <h4 className="font-bold text-[14px] leading-4 mb-[2px] truncate uppercase">
                    {finalProduct.name_eng}
                  </h4>
                  <p className="font-medium text-[#00000080] text-[12px] leading-4 truncate">
                    {finalProduct.name_ru}
                  </p>
                  <div className="mt-1 text-[12px] text-[#00000099]">
                    Всего: {totalQty} шт.
                  </div>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-[14px] leading-4 mb-[2px] truncate uppercase">
                    Товар #{productId}
                  </h4>
                  <p className="font-medium text-[#00000080] text-[12px] leading-4 truncate">
                    Название недоступно
                  </p>
                  <div className="mt-1 text-[12px] text-[#00000099]">
                    Всего: {totalQty} шт.
                  </div>
                </>
              )}
            </div>
          </div>
          <span className="font-medium text-[16px] font-roboto whitespace-nowrap">
            {totalForProduct.toLocaleString('ru-RU')}{' '}
            <span className="font-bold font-ysabeau text-[14px]">₽</span>
          </span>
        </div>

        <div className="mt-3 ml-[95px] flex flex-col gap-3">
          {variants.map(variant => (
            <div
              key={`${variant.id}-${variant.size ?? ''}-${variant.color ?? ''}`}
              className="flex items-center justify-between py-1"
            >
              <div className="text-[12px] text-[#00000099] flex items-center gap-4">
                <span>
                  {(() => {
                    const firstSizeKey = finalProduct?.size
                      ? Object.keys(finalProduct.size)[0]
                      : undefined;
                    const resolvedKey =
                      variant.size && variant.size !== ''
                        ? variant.size!
                        : (firstSizeKey ?? '');
                    const resolvedLabel = resolvedKey
                      ? (finalProduct?.size?.[resolvedKey]?.size ?? resolvedKey)
                      : '-';
                    return <>Размер: {resolvedLabel}</>;
                  })()}
                </span>
                <span className="flex items-center gap-1">
                  Цвет:
                  <span
                    className="inline-block w-3 h-3 rounded-full border"
                    style={{
                      backgroundColor: (finalProduct?.colors?.[
                        variant.color ?? ''
                      ] ??
                        variant.color ??
                        'transparent') as string,
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Уменьшить количество"
                  onClick={() => handleDec(variant)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
                >
                  <RemoveRoundedIcon fontSize="small" />
                </button>
                <input
                  className="w-[56px] h-[30px] border border-[#E5E5E5] text-center text-[14px] rounded outline-none focus:border-gray-400"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={String(variant.quantity)}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D+/g, '');
                    const numeric = parseInt(raw, 10);
                    if (Number.isFinite(numeric) && numeric > 0) {
                      handleSetQty(variant, numeric);
                    }
                  }}
                />
                <button
                  aria-label="Увеличить количество"
                  onClick={() => handleInc(variant)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
                >
                  <AddRoundedIcon fontSize="small" />
                </button>
                <button
                  aria-label="Удалить вариант"
                  onClick={() => handleDel(variant)}
                  className="ml-1 p-1 rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors duration-150 transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </li>
      {isLast && <HorizontalLine width="720px" />}
    </React.Fragment>
  );
});

export default CartItemGroup;
