"use client";

// Импортируем необходимые хуки и экшены
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setFavorites } from "@/store/features/favorites/favorites.slice";
import { getLocalStorage } from "@/utils/storage";

/**
 * Компонент AuthCheck:
 * - При монтировании загружает избранное из localStorage для гостей
 * - Не выполняет автоматическую авторизацию
 * - Только инициализирует избранное в redux
 */
const AuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Загружаем избранное из localStorage только для гостей
    // Авторизованные пользователи получают избранное с сервера
    if (!isAuthenticated) {
      try {
        const localFavorites = getLocalStorage("favorites", []);
        if (Array.isArray(localFavorites)) {
          dispatch(setFavorites(localFavorites));
        } else {
          dispatch(setFavorites([]));
        }
      } catch (localStorageError) {
        console.warn(
          "Failed to load favorites from localStorage:",
          localStorageError
        );
        // Если localStorage пустой или повреждён — кладём пустой массив
        dispatch(setFavorites([]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей — эффект выполнится только один раз

  // Компонент ничего не рендерит, он только инициализирует избранное
  return null;
};

export default AuthCheck;
