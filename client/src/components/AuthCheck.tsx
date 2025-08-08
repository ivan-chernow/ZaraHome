"use client";

// Импортируем необходимые хуки и экшены
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setFavorites } from "@/store/features/favorites/favorites.slice";
import { getLocalStorage } from "@/utils/storage";
import { setCartItems } from "@/store/features/cart/cartItems.slice";

/**
 * Компонент AuthCheck:
 * - При монтировании загружает избранное и корзину из localStorage для гостей
 * - Не выполняет автоматическую авторизацию
 * - Только инициализирует локальные состояния в redux для гостей
 */
const AuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Загружаем избранное и корзину из localStorage только для гостей
    // Авторизованные пользователи получают данные с сервера
    if (!isAuthenticated) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default AuthCheck;
