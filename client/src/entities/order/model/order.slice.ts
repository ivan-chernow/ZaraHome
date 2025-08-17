import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/entities/cart/model/cartItems.slice";

export interface OrderItem extends CartItem {
  orderId: string;
  createdAt: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  totalCount: number;
  createdAt: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  address?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  currentOrderId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  currentOrderId: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<{
      cartItems: CartItem[];
      totalPrice: number;
      address?: string;
    }>) => {
      const { cartItems, totalPrice, address } = action.payload;
      
      // Генерируем уникальный ID заказа
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const createdAt = new Date().toISOString();
      
      // Создаём заказ
      const newOrder: Order = {
        id: orderId,
        items: cartItems.map(item => ({
          ...item,
          orderId,
          createdAt,
          status: "pending" as const,
        })),
        totalPrice,
        totalCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        createdAt,
        status: "pending",
        address,
      };
      
      state.orders.unshift(newOrder); // Добавляем в начало списка
      state.currentOrder = newOrder;
    },
    
    updateOrderStatus: (state, action: PayloadAction<{
      orderId: string;
      status: Order["status"];
    }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.items.forEach(item => {
          item.status = status;
        });
      }
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentOrderId: (state, action: PayloadAction<number>) => {
      state.currentOrderId = action.payload;
    },
  },
});

export const {
  createOrder,
  updateOrderStatus,
  clearCurrentOrder,
  setLoading,
  setError,
  setCurrentOrderId,
} = orderSlice.actions;

export default orderSlice.reducer;
