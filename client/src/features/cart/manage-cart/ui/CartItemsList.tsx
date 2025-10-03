'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import {
  selectCartItems,
  addCartItem,
  removeCartItem,
  deleteCartItem,
  setCartItemQuantity,
  type CartItem as CartItemType,
} from '@/entities/cart/model/cartItems.slice';
import {
  useGetProductsByIdsQuery,
  type Product,
} from '@/entities/product/api/products.api';
import { findProductById } from '@/entities/category/lib/catalog.utils';
import { RootState } from '@/shared/config/store/store';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Компонент для отображения и управления списком товаров в корзине
 * Отвечает за отображение товаров, изменение количества, удаление
 */
export const CartItemsList: React.FC = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useSelector(selectCartItems);
  const categories = useSelector((s: RootState) => s.catalog.categories);

  const ids = cartItems.map(i => i.id);
  const {
    data: productsByIds,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useGetProductsByIdsQuery(ids, {
    skip: !mounted || ids.length === 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const safeProducts: Product[] = Array.isArray(productsByIds)
    ? productsByIds
    : [];
  const idToProduct: Record<number, Product> = safeProducts.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<number, Product>
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getFullImageUrl = useCallback(
    (path?: string): string | undefined => {
      if (!path) return undefined;
      try {
        const cleanPath = path.replace(/^\/+/, '');
        return `${API_URL}/${cleanPath}`;
      } catch {
        return path;
      }
    },
    [API_URL]
  );

  const handleIncreaseQuantity = useCallback(
    (item: CartItemType) => {
      const product = idToProduct[item.id];
      if (product) {
        dispatch(
          addCartItem({
            id: item.id,
            price: item.price,
            img: item.img,
            size: item.size,
            color: item.color,
            name_eng: product.name_eng,
            name_ru: product.name_ru,
          })
        );
      }
    },
    [dispatch, idToProduct]
  );

  const handleDecreaseQuantity = useCallback(
    (item: CartItemType) => {
      dispatch(
        removeCartItem({
          id: item.id,
          size: item.size,
          color: item.color,
        })
      );
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (item: CartItemType) => {
      dispatch(
        deleteCartItem({
          id: item.id,
          size: item.size,
          color: item.color,
        })
      );
    },
    [dispatch]
  );

  const handleQuantityChange = useCallback(
    (item: CartItemType, newQuantity: number) => {
      if (newQuantity <= 0) {
        handleDeleteItem(item);
      } else {
        dispatch(
          setCartItemQuantity({
            id: item.id,
            size: item.size,
            color: item.color,
            quantity: newQuantity,
          })
        );
      }
    },
    [dispatch, handleDeleteItem]
  );

  if (isLoadingProducts) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex space-x-4 p-4 border rounded-lg">
              <div className="w-20 h-20 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isProductsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Ошибка загрузки товаров</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Ваша корзина пуста</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item, index) => {
        const product = idToProduct[item.id];
        if (!product) return null;

        const productData = findProductById(categories, item.id);
        const imageUrl = getFullImageUrl(
          item.img || (product.img && product.img[0])
        );

        return (
          <div
            key={`${item.id}-${item.size}-${item.color}-${index}`}
            className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm"
          >
            {/* Изображение товара */}
            <div className="flex-shrink-0">
              <Link href={`/products/${item.id}`}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name_ru || item.name_eng || 'Product'}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Нет фото</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Информация о товаре */}
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.id}`}>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate">
                  {item.name_ru ||
                    item.name_eng ||
                    product.name_ru ||
                    product.name_eng}
                </h3>
              </Link>

              <div className="mt-1 space-y-1">
                {item.size && (
                  <p className="text-sm text-gray-600">Размер: {item.size}</p>
                )}
                {item.color && (
                  <p className="text-sm text-gray-600">Цвет: {item.color}</p>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {item.price} ₽
                </p>
              </div>
            </div>

            {/* Управление количеством */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDecreaseQuantity(item)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Уменьшить количество"
              >
                <RemoveRoundedIcon className="w-5 h-5 text-gray-600" />
              </button>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e =>
                  handleQuantityChange(item, parseInt(e.target.value) || 1)
                }
                className="w-16 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => handleIncreaseQuantity(item)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Увеличить количество"
              >
                <AddRoundedIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Общая стоимость позиции */}
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {(item.price * item.quantity).toLocaleString()} ₽
              </p>
            </div>

            {/* Кнопка удаления */}
            <button
              onClick={() => handleDeleteItem(item)}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
              aria-label="Удалить товар"
            >
              <CloseIcon className="w-5 h-5 text-red-600" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsList;
