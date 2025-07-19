"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCredentials,
  setAuthenticating,
} from "@/store/features/auth/auth.slice";
import { useRefreshMutation, useLazyGetUserQuery } from "@/api/auth.api";
import { useGetFavoritesQuery } from "@/api/favorites.api";
import { setFavorites } from "@/store/features/favorites/favorites.slice";

const AuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [refresh] = useRefreshMutation();
  const [getUser] = useLazyGetUserQuery();
  const { data: favorites } = useGetFavoritesQuery();

  useEffect(() => {
    const trySilentLogin = async () => {
      if (isAuthenticated) {
        return;
      }

      dispatch(setAuthenticating(true));
      try {
        // 1. Попытка обновить токен
        const { accessToken } = await refresh().unwrap();

        if (accessToken) {
          // 2. Если токен получен, запрашиваем данные пользователя
          const { data: user } = await getUser();
          if (user) {
            dispatch(setCredentials({ user, accessToken }));
            // После успешного входа, загружаем избранное
            const { data: favorites } = await getFavorites();
            if (favorites) {
              dispatch(setFavorites(favorites));
            }
          }
        }
      } catch {
        // Ожидаемая ошибка для гостей, ничего не делаем
        console.log("No active session found.");
      } finally {
        dispatch(setAuthenticating(false));
      }
    };

    trySilentLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз

  return null;
};

export default AuthCheck;
