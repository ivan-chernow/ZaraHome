"use client";

// Импортируем необходимые хуки и экшены
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import { setFavorites } from "@/entities/favorite/model/favorites.slice";
import { getLocalStorage, removeLocalStorage } from "@/shared/lib/storage";
import { setCartItems } from "@/entities/cart/model/cartItems.slice";
import { clearSelectedAddress } from "@/entities/user/model/delivery.slice";
import { setActiveView } from "@/features/profile/model/profile.slice";
import { useGetFavoritesQuery } from "@/entities/favorite/api/favorites.api";
import { useAddToCartMutation, useGetCartQuery } from "@/entities/cart/api/cart.api";
import type { Product } from "@/entities/product/api/products.api";

/**
 * Компонент AuthCheck:
 * - При монтировании загружает избранное и корзину из localStorage для гостей
 * - Не выполняет автоматическую авторизацию
 * - Только инициализирует локальные состояния в redux для гостей
 */
const AuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const prevAuthRef = useRef<boolean>(isAuthenticated);
  // Доступ к корзине не требуется для слияния: читаем из localStorage прямо перед мержем
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
  // Можем понадобиться позже для UI, сейчас не используется напрямую

  useEffect(() => {
    if (!isAuthenticated) {
      // Гость: читаем локальные снэпшоты
      try {
        const localFavorites = getLocalStorage("favorites", []);
        dispatch(
          setFavorites(Array.isArray(localFavorites) ? localFavorites : [])
        );
      } catch {
        dispatch(setFavorites([]));
      }

      try {
        const localCart = getLocalStorage("cart", []);
        dispatch(setCartItems(Array.isArray(localCart) ? localCart : []));
      } catch {
        dispatch(setCartItems([]));
      }
    } else {
      // Авторизованный: моментально поднимаем локальные избранные по ключу пользователя,
      // чтобы UI не мигал до ответа сервера
      const key = user?.id ? `favorites:${user.id}` : "favorites";
      try {
        const localFavorites = getLocalStorage(key, []);
        if (Array.isArray(localFavorites)) {
          dispatch(setFavorites(localFavorites));
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Авторизованный пользователь: синхронизируем избранное с сервером
    if (isAuthenticated && Array.isArray(favoritesData)) {
      const ids = favoritesData.map((p) => p.id);
      dispatch(setFavorites(ids));
    }
  }, [isAuthenticated, favoritesData, dispatch]);

  useEffect(() => {
    // Авторизованный пользователь: поднимаем серверную корзину в локальный стор
    if (isAuthenticated && Array.isArray(serverCart)) {
      const toItems = (serverCart as Product[]).map((p) => ({
        id: p.id,
        // Берем первую цену из size, если есть
        price: (() => {
          const sizes = p.size as any;
          const first =
            sizes && typeof sizes === "object"
              ? (Object.values(sizes)[0] as any)
              : null;
          return first && typeof first.price === "number" ? first.price : 0;
        })(),
        quantity: 1,
        img: Array.isArray(p.img) ? p.img[0] : undefined,
      }));
      dispatch(setCartItems(toItems));
    }
  }, [isAuthenticated, serverCart, dispatch]);

  useEffect(() => {
    // При входе пользователя переносим товары гостевой корзины на серверную
    // Выполняем один раз на пользователя и помечаем флагом в localStorage, чтобы переживать перезагрузки
    const userId: string | null = user?.id ?? null;
    if (!isAuthenticated || !userId) return;
    if (mergedUserRef.current === userId) return;

    const guestCart = getLocalStorage("cart", []);
    const idsFromLocal: number[] = Array.isArray(guestCart)
      ? Array.from(
          new Set(
            guestCart
              .map((i: any) => (i && typeof i.id === "number" ? i.id : null))
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
        await Promise.allSettled(
          idsFromLocal.map((pid) => addToCart(pid).unwrap())
        );
      } catch {
        // Игнорируем частичные ошибки: добавление идемпотентно на бэке
      } finally {
        mergedUserRef.current = userId;
        // Очищаем гостевую корзину после переноса
        removeLocalStorage("cart");
        setIsMerging(false);
      }
    })();
  }, [isAuthenticated, user, addToCart]);

  useEffect(() => {
    // Очищаем корзину только при переходе из авторизованного состояния в гостевое (logout)
    if (prevAuthRef.current === true && isAuthenticated === false) {
      dispatch(setCartItems([]));
      removeLocalStorage("cart");
      // Очищаем выбранный адрес доставки при выходе
      dispatch(clearSelectedAddress());
      // Сбрасываем секцию профиля на "Мои заказы" при выходе
      dispatch(setActiveView("my-orders"));
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, dispatch]);

  return null;
};

export default AuthCheck;
