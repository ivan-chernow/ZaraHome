import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Тип для элемента корзины
export interface CartItem {
  id: number;
  quantity: number;
  price: number; // Добавляем цену для подсчёта суммы
  img?: string; // Добавляем ссылку на картинку
}

interface CartItemsState {
  items: CartItem[];
}

const initialState: CartItemsState = {
  items: [],
};

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addCartItem: (state, action: PayloadAction<{ id: number; price: number; img?: string }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id: action.payload.id, quantity: 1, price: action.payload.price, img: action.payload.img });
      }
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find((item) => item.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== action.payload);
        }
      }
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Селекторы
export const selectCartItems = (state: { cartItems: CartItemsState }) => state.cartItems.items;
export const selectCartTotalCount = (state: { cartItems: CartItemsState }) =>
  state.cartItems.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state: { cartItems: CartItemsState }) =>
  state.cartItems.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

export const {
  setCartItems,
  addCartItem,
  removeCartItem,
  deleteCartItem,
  clearCart,
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer; 