import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '../model/order.slice';

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  totalPrice: number;
  totalCount: number;
  address?: string;
  phone?: string;
  comment?: string;
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
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  totalPrice: number;
  totalCount: number;
  status: string;
  address?: string;
  phone?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    
    getUserOrders: builder.query<CreateOrderResponse[], void>({
      query: () => '/orders/my',
      providesTags: ['Orders'],
    }),
    
    getActiveOrder: builder.query<CreateOrderResponse | null, void>({
      query: () => '/orders/active',
      providesTags: ['Orders'],
    }),
    
    getOrderById: builder.query<CreateOrderResponse, number>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),
    
    updateOrderStatus: builder.mutation<CreateOrderResponse, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
    
    cancelOrder: builder.mutation<CreateOrderResponse, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Orders'],
    }),
    
    updateOrder: builder.mutation<CreateOrderResponse, UpdateOrderRequest>({
      query: ({ id, ...updateData }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: updateData,
      }),
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
