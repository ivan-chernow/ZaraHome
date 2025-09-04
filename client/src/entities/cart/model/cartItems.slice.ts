import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorage } from '@/shared/lib/storage';

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

const loadInitialCartItems = (): CartItem[] => {
  const raw = getLocalStorage('cart', []);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && typeof i.id === 'number' && typeof i.price === 'number')
    .map((i) => ({
      id: i.id,
      price: i.price,
      img: typeof i.img === 'string' ? i.img : undefined,
      quantity:
        typeof i.quantity === 'number' && Number.isFinite(i.quantity) && i.quantity > 0
          ? Math.floor(i.quantity)
          : 1,
    }));
};

const initialState: CartItemsState = {
  items: loadInitialCartItems(),
};

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addCartItem: (state, action: PayloadAction<{ id: number; price: number; img?: string }>) => {
      const { id, price, img } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, quantity: 1, price, img });
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
    setCartItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const nextQty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = nextQty;
      }
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
  setCartItemQuantity,
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer; 