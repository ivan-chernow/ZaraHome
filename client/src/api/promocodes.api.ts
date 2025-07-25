import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Типы для промокодов
export interface Promocode {
    id: number;
    code: string;
    discount: number;
    isActive: boolean;
    createdAt: string;
}

// Типы для запросов
export interface CreatePromocodeRequest {
    code: string;
    discount: number;
}

export interface ApplyPromocodeRequest {
    code: string;
    orderAmount: number;
}

// Типы для ответов
export interface ApplyPromocodeResponse {
    isValid: boolean;
    code: string;
    discount: number;
    finalAmount: number;
    message?: string;
}

export interface ApiError {
    status: number;
    data: {
        message: string;
        error?: string;
    };
}

// Создание API
export const promocodesApi = createApi({
    reducerPath: 'promocodesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Promocode'],
    endpoints: (builder) => ({
        // Создание промокода (только для админов)
        createPromocode: builder.mutation<Promocode, CreatePromocodeRequest>({
            query: (body) => ({
                url: '/promocodes',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Promocode'],
        }),

        // Применение промокода
        applyPromocode: builder.mutation<ApplyPromocodeResponse, ApplyPromocodeRequest>({
            query: (body) => ({
                url: '/promocodes/apply',
                method: 'POST',
                body,
            }),
        }),

        // Получение всех активных промокодов
        getAllActive: builder.query<Promocode[], void>({
            query: () => ({
                url: '/promocodes',
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Promocode' as const, id })),
                        { type: 'Promocode', id: 'LIST' },
                    ]
                    : [{ type: 'Promocode', id: 'LIST' }],
        }),

        // Деактивация промокода (только для админов)
        deactivatePromocode: builder.mutation<Promocode, string>({
            query: (code) => ({
                url: `/promocodes/${code}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, code) => [
                { type: 'Promocode', id: code },
                { type: 'Promocode', id: 'LIST' }
            ],
        }),
    }),
});

// Экспорт хуков
export const {
    useCreatePromocodeMutation,
    useApplyPromocodeMutation,
    useGetAllActiveQuery,
    useDeactivatePromocodeMutation,
} = promocodesApi;
