import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  address?: string;
  phone?: string;
  comment?: string;
  promocode?: string;
}

export interface UpdateOrderRequest {
  id: number;
  address?: string;
  phone?: string;
  comment?: string;
}

export interface CreateOrderResponse {
  id: number;
  items: Array<{
    productId: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  status: string;
  address?: string;
  phone?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      transformResponse: (response: { success: boolean; data: CreateOrderResponse; message: string }) => response.data,
      invalidatesTags: ['Orders'],
    }),
    
    getUserOrders: builder.query<CreateOrderResponse[], void>({
      query: () => '/orders/my',
      transformResponse: (response: { success: boolean; data: CreateOrderResponse[]; message: string }) => response.data,
      providesTags: ['Orders'],
    }),
    
    getActiveOrder: builder.query<CreateOrderResponse | null, void>({
      query: () => '/orders/active',
      transformResponse: (response: { success: boolean; data: CreateOrderResponse | null; message: string }) => response.data,
      providesTags: ['Orders'],
    }),
    
    getOrderById: builder.query<CreateOrderResponse, number>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: { success: boolean; data: CreateOrderResponse; message: string }) => response.data,
      providesTags: ['Orders'],
    }),
    
    updateOrderStatus: builder.mutation<CreateOrderResponse, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      transformResponse: (response: { success: boolean; data: CreateOrderResponse; message: string }) => response.data,
      invalidatesTags: ['Orders'],
    }),
    
    cancelOrder: builder.mutation<CreateOrderResponse, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      transformResponse: (response: { success: boolean; data: CreateOrderResponse; message: string }) => response.data,
      invalidatesTags: ['Orders'],
    }),
    
    updateOrder: builder.mutation<CreateOrderResponse, UpdateOrderRequest>({
      query: ({ id, ...updateData }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      transformResponse: (response: { success: boolean; data: CreateOrderResponse; message: string }) => response.data,
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetActiveOrderQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;
