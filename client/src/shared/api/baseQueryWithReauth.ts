import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
// Избегаем циклической зависимости с auth.api/auth.slice
// Диспетчим экшены по строковым типам: 'auth/setCredentials' и 'auth/logout'
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Берем токен из Redux, а не из localStorage, чтобы избежать авто-логина на перезагрузке
    const state: any = getState();
    const token = state?.auth?.accessToken ?? null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Обработка ошибки 429 (Too Many Requests)
  if (result.error && result.error.status === 429) {
    console.warn('Rate limit exceeded, retrying after delay...');
    // Ждем 2 секунды перед повторной попыткой
    await new Promise(resolve => setTimeout(resolve, 2000));
    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error && result.error.status === 401) {
    console.log('Unauthorized request, attempting token refresh...');
    const state: any = api.getState?.();
    const isAuthenticated: boolean = !!state?.auth?.isAuthenticated;
    // Не пытаемся рефрешить токен, если пользователь не вошел (исключаем авто-логин)
    if (!isAuthenticated) {
      return result;
    }
    
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            credentials: 'include',
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          
          // Обновляем только токен, пользователь остается прежним
          api.dispatch({ type: 'auth/setCredentials', payload: { accessToken, user: null } });
          
          console.log('Token refreshed successfully, retrying original request...');
          
          // Повторяем исходный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log('Token refresh failed, logging out...');
          api.dispatch({ type: 'auth/logout' });
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
        api.dispatch({ type: 'auth/logout' });
      } finally {
        release();
      }
    } else {
      console.log('Token refresh already in progress, waiting...');
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
}; 