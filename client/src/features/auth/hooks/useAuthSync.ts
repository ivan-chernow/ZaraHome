'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { setFavorites } from '@/entities/favorite/model/favorites.slice';
import { getLocalStorage, removeLocalStorage } from '@/shared/lib/storage';
import { setCartItems } from '@/entities/cart/model/cartItems.slice';
import { clearSelectedAddress } from '@/entities/user/model/delivery.slice';
import { setActiveView } from '@/features/profile/model/profile.slice';
import { useGetFavoritesQuery } from '@/entities/favorite/api/favorites.api';
import {
  useAddToCartMutation,
  useGetCartQuery,
} from '@/entities/cart/api/cart.api';
import type { Product } from '@/entities/product/api/products.api';

/**
 * Хук для синхронизации авторизации и данных пользователя:
 * - При монтировании загружает избранное и корзину из localStorage для гостей
 * - Синхронизирует данные с сервером для авторизованных пользователей
 * - Выполняет слияние гостевой корзины при авторизации
 */
export const useAuthSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const prevAuthRef = useRef<boolean>(isAuthenticated);

  const { data: favoritesData } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addToCart] = useAddToCartMutation();
  const [isMerging, setIsMerging] = useState(false);
  const { data: serverCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated || isMerging,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // В пределах одной сессии не выполнять слияние повторно для одного и того же пользователя
  const mergedUserRef = useRef<string | null>(null);

  // Инициализация локальных данных при монтировании
  useEffect(() => {
    if (!isAuthenticated) {
      // Гость: читаем локальные снэпшоты
      try {
        const localFavorites = getLocalStorage('favorites', []);
        dispatch(
          setFavorites(Array.isArray(localFavorites) ? localFavorites : [])
        );
      } catch {
        dispatch(setFavorites([]));
      }

      try {
        const localCart = getLocalStorage('cart', []);
        dispatch(setCartItems(Array.isArray(localCart) ? localCart : []));
      } catch {
        dispatch(setCartItems([]));
      }
    } else {
      // Авторизованный: моментально поднимаем локальные избранные по ключу пользователя
      const key = user?.id ? `favorites:${user.id}` : 'favorites';
      try {
        const localFavorites = getLocalStorage(key, []);
        if (Array.isArray(localFavorites)) {
          dispatch(setFavorites(localFavorites));
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация избранного с сервером
  useEffect(() => {
    if (isAuthenticated && Array.isArray(favoritesData)) {
      const ids = favoritesData.map(p => p.id);
      dispatch(setFavorites(ids));
    }
  }, [isAuthenticated, favoritesData, dispatch]);

  // Синхронизация корзины с сервером
  useEffect(() => {
    if (isAuthenticated && Array.isArray(serverCart)) {
      const toItems = (serverCart as Product[]).map(p => ({
        id: p.id,
        price: (() => {
          const sizes = p.size as Record<string, { price: number }> | undefined;
          const first =
            sizes && typeof sizes === 'object'
              ? (Object.values(sizes)[0] as { price: number } | undefined)
              : null;
          return first && typeof first.price === 'number' ? first.price : 0;
        })(),
        quantity: 1,
        img: Array.isArray(p.img) ? p.img[0] : undefined,
      }));
      dispatch(setCartItems(toItems));
    }
  }, [isAuthenticated, serverCart, dispatch]);

  // Слияние гостевой корзины при авторизации
  useEffect(() => {
    const userId: string | null = user?.id ?? null;
    if (!isAuthenticated || !userId) return;
    if (mergedUserRef.current === userId) return;

    const guestCart = getLocalStorage('cart', []);
    const idsFromLocal: number[] = Array.isArray(guestCart)
      ? Array.from(
          new Set(
            guestCart
              .map((i: unknown) =>
                i &&
                typeof i === 'object' &&
                'id' in i &&
                typeof i.id === 'number'
                  ? i.id
                  : null
              )
              .filter((v: number | null): v is number => v !== null)
          )
        )
      : [];

    if (idsFromLocal.length === 0) {
      mergedUserRef.current = userId;
      return;
    }

    (async () => {
      try {
        setIsMerging(true);
        const results = await Promise.allSettled(
          idsFromLocal.map(pid => addToCart(pid).unwrap())
        );

        const errors = results.filter(result => result.status === 'rejected');
        if (errors.length > 0) {
          console.warn(
            'Некоторые товары не удалось добавить в корзину:',
            errors
          );
        }
      } catch (error) {
        console.error('Ошибка при слиянии корзины:', error);
      } finally {
        mergedUserRef.current = userId;
        removeLocalStorage('cart');
        setIsMerging(false);
      }
    })();
  }, [isAuthenticated, user, addToCart]);

  // Очистка данных при выходе
  useEffect(() => {
    if (prevAuthRef.current === true && isAuthenticated === false) {
      dispatch(setCartItems([]));
      removeLocalStorage('cart');
      dispatch(clearSelectedAddress());
      dispatch(setActiveView('my-orders'));
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, dispatch]);
};
