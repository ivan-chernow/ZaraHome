import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../shared/api/baseQueryWithReauth';
import { Product } from './products.api';

export const favoritesApi = createApi({
    reducerPath: 'favoritesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Favorites'],
    endpoints: (builder) => ({
        // Accept userId to scope the cache key per user. The API still calls the same endpoint.
        getFavorites: builder.query<Product[], number | undefined>({
            query: () => '/favorites',
            providesTags: ['Favorites'],
        }),
        addToFavorites: builder.mutation<void, number>({
            query: (productId) => ({
                url: `/favorites/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Favorites'],
        }),
        removeFromFavorites: builder.mutation<void, number>({
            query: (productId) => ({
                url: `/favorites/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Favorites'],
        }),
        getFavoriteStatus: builder.query<Record<number, boolean>, number[]>({
            query: (productIds) => `/favorites/status?productIds=${productIds.join(',')}`,
        }),
        getProductsByIds: builder.query<Product[], number[]>({
            query: (ids) => {
                if (!ids || ids.length === 0) {
                    return '/products?ids=empty';
                }
                return `/products?ids=${ids.join(',')}`;
            },
            keepUnusedDataFor: 300,
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useLazyGetFavoriteStatusQuery,
    useGetProductsByIdsQuery,
} = favoritesApi;
