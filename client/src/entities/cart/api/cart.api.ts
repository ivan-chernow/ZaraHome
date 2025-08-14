import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../shared/api/baseQueryWithReauth';
import type { Product } from './products.api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Product[], number | undefined>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    getCartStatus: builder.query<Record<number, boolean>, number[]>({
      query: (productIds) => `/cart/status?productIds=${productIds.join(',')}`,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useLazyGetCartStatusQuery,
} = cartApi; 