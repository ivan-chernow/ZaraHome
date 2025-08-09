import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
// Избегаем циклической зависимости с auth.api/auth.slice
// Диспетчим экшены по строковым типам: 'auth/setCredentials' и 'auth/logout'
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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

  if (result.error && result.error.status === 401) {
    console.log('Unauthorized request, attempting token refresh...');
    
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
          
          // Сохраняем токен на клиенте
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          
          // Обновляем только токен, пользователь остается прежним
          api.dispatch({ type: 'auth/setCredentials', payload: { accessToken, user: null } });
          
          console.log('Token refreshed successfully, retrying original request...');
          
          // Повторяем исходный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log('Token refresh failed, logging out...');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          api.dispatch({ type: 'auth/logout' });
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
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