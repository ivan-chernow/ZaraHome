'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import {
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
  addCartItem,
  removeCartItem,
  deleteCartItem,
  type CartItem as CartItemType,
} from '@/entities/cart/model/cartItems.slice';
import { RootState } from '@/shared/config/store/store';
import { findProductById } from '@/entities/category/lib/catalog.utils';
import { useCheckout } from '@/features/cart/checkout/hooks/useCheckout';
import { SectionTitle } from '@/shared/ui/SectionTitle';

const CartContent: React.FC = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const cartItems = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);
  const { handleCheckout, isCreatingOrder } = useCheckout();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const getFullImageUrl = useCallback(
    (path?: string): string | undefined => {
      if (!path) return undefined;
      try {
        const cleanPath = path.replace(/^\/+/, '');
        // Если ссылка уже абсолютная – возвращаем как есть
        if (/^https?:\/\//i.test(path)) return path;
        return `${API_URL}/${cleanPath}`;
      } catch {
        return path;
      }
    },
    [API_URL]
  );

  // Берём продукты из каталога (как в модалке корзины) для корректных size/colors
  const categories = useSelector((s: RootState) => s.catalog.categories);
  const idToProduct: Record<number, any> = cartItems.reduce(
    (acc, it) => {
      const p = findProductById(categories, it.id);
      if (p) acc[it.id] = p;
      return acc;
    },
    {} as Record<number, any>
  );

  const resolveSizeLabel = useCallback(
    (item: CartItemType): string | undefined => {
      const product = idToProduct[item.id];
      if (!product || !item.size) return item.size;
      const sizeData = product.size?.[item.size];
      return sizeData?.size ?? item.size;
    },
    [idToProduct]
  );

  const resolveColorHex = useCallback(
    (item: CartItemType): string | undefined => {
      const product = idToProduct[item.id];
      const raw = item.color;
      if (!raw) return undefined;
      // Если уже HEX — возвращаем
      if (typeof raw === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(raw)) {
        return raw;
      }
      // Иначе пытаемся достать по ключу из продукта
      const hex = product?.colors?.[raw as keyof typeof product.colors];
      return typeof hex === 'string' ? hex : undefined;
    },
    [idToProduct]
  );

  const handleIncrease = useCallback(
    (item: CartItemType) => {
      dispatch(
        addCartItem({
          id: item.id,
          price: item.price,
          img: item.img,
          size: item.size,
          color: item.color,
          name_eng: item.name_eng,
          name_ru: item.name_ru,
        })
      );
    },
    [dispatch]
  );

  const handleDecrease = useCallback(
    (item: CartItemType) => {
      dispatch(
        removeCartItem({ id: item.id, size: item.size, color: item.color })
      );
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (item: CartItemType) => {
      dispatch(
        deleteCartItem({ id: item.id, size: item.size, color: item.color })
      );
    },
    [dispatch]
  );

  // Плейсхолдер для SSR/до монтирования во избежание мигания и 0 в итогах
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="text-sm text-gray-500 mb-8">
          <span>Корзина</span>
        </nav>
        <div className="flex justify-between items-start gap-12">
          <div className="flex-1 space-y-6">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-20 bg-gray-100 animate-pulse rounded" />
              <div className="h-20 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-base text-gray-500 mb-2">Итого</p>
            <p className="text-5xl font-bold mb-2">
              <span className="inline-block w-24 h-10 bg-gray-200 animate-pulse rounded" />
            </p>
            <p className="text-base text-gray-500 mb-12">
              <span className="inline-block w-20 h-5 bg-gray-200 animate-pulse rounded" />
            </p>
            <button className="bg-gray-300 text-white py-4 px-12 rounded font-medium text-lg cursor-not-allowed">
              Перейти к оформлению
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-8">
        <span>Корзина</span>
      </nav>

      <div className="flex justify-between items-start gap-12">
        {/* Левая часть - товары в корзине */}
        <div className="flex-1">
          <SectionTitle title="В вашей корзине" />
          {/* Все товары без рамки */}
          <div className="space-y-8">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded flex-shrink-0 overflow-hidden bg-gray-100">
                      {item.img || idToProduct[item.id]?.img?.[0] ? (
                        <Image
                          src={
                            getFullImageUrl(idToProduct[item.id]?.img?.[0]) ||
                            getFullImageUrl(item.img) ||
                            (item.img || '')
                          }
                          alt={item.name_ru || item.name_eng || 'Товар'}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {item.name_eng || idToProduct[item.id]?.name_eng || 'Товар'}
                      </h3>
                      <p className="text-base text-gray-500">
                        {item.name_ru || idToProduct[item.id]?.name_ru || ''}
                      </p>
                      <p className="text-sm text-gray-400">
                        {resolveSizeLabel(item) ? `Размер: ${resolveSizeLabel(item)}` : ''}
                        {resolveSizeLabel(item) && item.color ? ' · ' : ''}
                        {item.color ? (
                          <span className="inline-flex items-center gap-1">
                            <span>Цвет:</span>
                            <span
                              className="inline-block w-3 h-3 rounded-full border"
                              style={{ backgroundColor: resolveColorHex(item) }}
                            />
                          </span>
                        ) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-gray-500 text-xl cursor-pointer"
                        onClick={() => handleDecrease(item)}
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span className="min-w-[30px] text-center text-lg">
                        {item.quantity}
                      </span>
                      <button
                        className="text-gray-500 text-xl cursor-pointer"
                        onClick={() => handleIncrease(item)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <span className="font-medium text-lg">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <button
                      className="text-gray-400 text-xl cursor-pointer"
                      onClick={() => handleDelete(item)}
                      aria-label="Удалить из корзины"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая часть - итоги */}
        <div className="text-center">
          <p className="text-base text-gray-500 mb-2">Итого</p>
          <p className="text-5xl font-bold mb-2">
            {totalPrice.toLocaleString('ru-RU')}₽
          </p>
          <p className="text-base text-gray-500 mb-12">
            {totalCount} товар{totalCount % 10 === 1 && totalCount % 100 !== 11 ? '' : totalCount % 10 >= 2 && totalCount % 10 <= 4 && (totalCount % 100 < 10 || totalCount % 100 >= 20) ? 'а' : 'ов'}
          </p>

          <button
            onClick={handleCheckout}
            disabled={isCreatingOrder}
            className="bg-black text-white py-4 px-12 rounded font-medium hover:bg-gray-800 transition-colors text-lg cursor-pointer"
          >
            {isCreatingOrder ? 'Оформляем...' : 'Перейти к оформлению'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
