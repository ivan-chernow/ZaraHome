"use client";

// Импортируем необходимые хуки и экшены
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setFavorites } from "@/store/features/favorites/favorites.slice";
import { getLocalStorage } from "@/utils/storage";
import { setCartItems } from "@/store/features/cart/cartItems.slice";
import { useGetFavoritesQuery } from "@/api/favorites.api";

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
  const { data: favoritesData } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

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

  return null;
};

export default AuthCheck;
