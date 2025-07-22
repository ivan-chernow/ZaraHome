"use client";

// Импортируем необходимые хуки и экшены
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCredentials,
  setAuthenticating,
} from "@/store/features/auth/auth.slice";
import { useRefreshMutation, useLazyGetUserQuery } from "@/api/auth.api";
import { setFavorites } from "@/store/features/favorites/favorites.slice";

/**
 * Компонент AuthCheck:
 * - При монтировании проверяет, авторизован ли пользователь.
 * - Если нет — пытается выполнить silent login через refresh токен.
 * - Если silent login успешен — подгружает пользователя и избранное с сервера.
 * - Если неуспешен (гость) — подгружает избранное из localStorage.
 * - В любом случае кладёт избранное в redux, чтобы всё приложение работало с одним источником.
 */
const AuthCheck = () => {
  const dispatch = useDispatch();

  // Получаем флаг авторизации из redux
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // RTK Query хуки для обновления токена и получения пользователя
  const [refresh] = useRefreshMutation();
  const [getUser] = useLazyGetUserQuery();

  useEffect(() => {
    // Асинхронная функция для проверки авторизации
    const trySilentLogin = async () => {
      // Если уже авторизован — ничего не делаем
      if (isAuthenticated) {
        return;
      }

      // Ставим флаг, что идёт процесс авторизации
      dispatch(setAuthenticating(true));
      try {
        // 1. Пробуем обновить токен (silent login)
        const { accessToken } = await refresh().unwrap();

        if (accessToken) {
          // 2. Если токен получен — получаем пользователя
          const { data: user } = await getUser();
          if (user) {
            // 3. Сохраняем пользователя и токен в redux
            dispatch(setCredentials({ user, accessToken }));

            // 4. Загружаем избранное с сервера (пример через fetch, можно через RTK Query)
            const response = await fetch("/api/favorites", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.ok) {
              const favorites = await response.json();
              dispatch(setFavorites(favorites));
            }
          }
        }
      } catch {
        // Если silent login не удался (гость):
        // 1. Пробуем загрузить избранное из localStorage
        try {
          const localFavorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
          );
          dispatch(setFavorites(localFavorites));
        } catch {
          // Если localStorage пустой или повреждён — кладём пустой массив
          dispatch(setFavorites([]));
        }
      } finally {
        // Снимаем флаг процесса авторизации
        dispatch(setAuthenticating(false));
      }
    };

    // Запускаем проверку при монтировании компонента
    trySilentLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей — эффект выполнится только один раз

  // Компонент ничего не рендерит, он только инициализирует авторизацию и избранное
  return null;
};

export default AuthCheck;
