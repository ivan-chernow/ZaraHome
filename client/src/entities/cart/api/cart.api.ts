import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import type { Product } from '@/entities/product/api/products.api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cart'],
  endpoints: builder => ({
    getCart: builder.query<Product[], number | undefined>({
      query: () => '/cart',
      providesTags: ['Cart'],
      keepUnusedDataFor: 60, // Кешируем на 1 минуту
    }),
    addToCart: builder.mutation<void, number>({
      query: productId => ({
        url: `/cart/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
      // Оптимистичные обновления
      onQueryStarted: async (productId, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          // В случае ошибки можно откатить изменения
          console.error('Ошибка добавления в корзину:', error);
        }
      },
    }),
    removeFromCart: builder.mutation<void, number>({
      query: productId => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      onQueryStarted: async (productId, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Ошибка удаления из корзины:', error);
        }
      },
    }),
    getCartStatus: builder.query<Record<number, boolean>, number[]>({
      query: productIds => `/cart/status?productIds=${productIds.join(',')}`,
      keepUnusedDataFor: 300, // Кешируем на 5 минут
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useLazyGetCartStatusQuery,
} = cartApi;
