import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setCredentials, logout } from 'src/store/features/auth/auth.slice';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
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
          
          // Сохраняем токен в localStorage
          localStorage.setItem('accessToken', accessToken);
          
          // Обновляем только токен, пользователь остается прежним
          api.dispatch(setCredentials({ accessToken, user: null }));
          
          console.log('Token refreshed successfully, retrying original request...');
          
          // Повторяем исходный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log('Token refresh failed, logging out...');
          localStorage.removeItem('accessToken');
          api.dispatch(logout());
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
        localStorage.removeItem('accessToken');
        api.dispatch(logout());
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