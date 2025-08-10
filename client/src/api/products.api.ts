import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

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
		endpoints: (builder) => ({
				getCatalog: builder.query<Category[], void>({
						query: () => '/products/catalog',
						providesTags: ['Products']
				}),
				getProductsByIds: builder.query<Product[], number[]>({
					query: (ids) => ({
						url: `/products?ids=${ids.join(',')}`,
						method: 'GET',
					}),
				}),
				addProduct: builder.mutation<Product, CreateProductDto>({
						query: (product) => ({
								url: '/products',
								method: 'POST',
								body: product
						}),
						invalidatesTags: ['Products']
				}),
		})
});

export const {
		useGetCatalogQuery,
		useGetProductsByIdsQuery,
		useAddProductMutation,
} = productsApi;


