import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { Category, CreateProductDto, Product } from './product.types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'],
  endpoints: builder => ({
    getCatalog: builder.query<Category[], void>({
      query: () => '/products/catalog',
      transformResponse: (response: {
        success: boolean;
        data: Category[];
        message: string;
      }) => {
        return response.data;
      },
      providesTags: ['Products'],
      keepUnusedDataFor: 600, // Кешируем на 10 минут
    }),
    getProductsByIds: builder.query<Product[], number[]>({
      query: (ids: number[]) => ({
        url: `/products?ids=${ids.join(',')}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        success: boolean;
        data: Product[];
        message: string;
      }) => {
        return response.data;
      },
      keepUnusedDataFor: 300, // Кешируем на 5 минут
    }),
    addProduct: builder.mutation<Product, CreateProductDto>({
      query: (product: CreateProductDto) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      transformResponse: (response: {
        success: boolean;
        data: Product;
        message: string;
      }) => {
        return response.data;
      },
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetProductsByIdsQuery,
  useAddProductMutation,
} = productsApi;
