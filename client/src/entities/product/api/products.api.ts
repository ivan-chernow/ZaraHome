import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';

export interface Product {
  id: number;
  name_eng: string;
  name_ru: string;
  img: string[];
  colors: { [key: string]: string };
  size: { [key: string]: { size: string; price: number } };
  deliveryDate: string;
  description: string;
  isNew?: boolean;
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isAvailable: boolean;
  categoryId: number;
  subCategoryId: number;
  typeId?: number;
}

export interface Type {
  id: number;
  name: string;
  subCategoryId: number;
  products: Product[];
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  types: Type[];
  products: Product[];
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
  products: Product[];
}

export interface CreateProductDto {
  name_eng: string;
  name_ru: string;
  description: string;
  categoryId: number;
  subCategoryId: number;
  typeId?: number;
  img: string[];
  colors: string[];
  size: { size: string; price: number }[];
  deliveryDate: string;
  isNew?: boolean;
  discount?: number;
  isAvailable: boolean;
}

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
