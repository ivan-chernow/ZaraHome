import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';
import { Product } from './products.api';

export const favoritesApi = createApi({
    reducerPath: 'favoritesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Favorites'],
    endpoints: (builder) => ({
        getFavorites: builder.query<Product[], void>({
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
            query: (ids) => `/products?ids=${ids.join(',')}`,
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
