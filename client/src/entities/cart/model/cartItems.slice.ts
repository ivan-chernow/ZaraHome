import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorage } from '@/shared/lib/storage';

// Тип для элемента корзины
export interface CartItem {
  id: number;
  quantity: number;
  price: number; // Добавляем цену для подсчёта суммы
  img?: string; // Добавляем ссылку на картинку
  size?: string; // Выбранный размер
  color?: string; // Выбранный цвет
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
      size: typeof i.size === 'string' ? i.size : undefined,
      color: typeof i.color === 'string' ? i.color : undefined,
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
    addCartItem: (state, action: PayloadAction<{ id: number; price: number; img?: string; size?: string; color?: string }>) => {
      const { id, price, img, size, color } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size && item.color === color);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, quantity: 1, price, img, size, color });
      }
    },
    removeCartItem: (state, action: PayloadAction<number | { id: number; size?: string; color?: string }>) => {
      const key = typeof action.payload === 'number' ? { id: action.payload } : action.payload;
      const existingItem = state.items.find((item) => item.id === key.id && (key.size === undefined || item.size === key.size) && (key.color === undefined || item.color === key.color));
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => !(item.id === key.id && (key.size === undefined || item.size === key.size) && (key.color === undefined || item.color === key.color)));
        }
      }
    },
    deleteCartItem: (state, action: PayloadAction<number | { id: number; size?: string; color?: string }>) => {
      const key = typeof action.payload === 'number' ? { id: action.payload } : action.payload;
      state.items = state.items.filter((item) => !(item.id === key.id && (key.size === undefined || item.size === key.size) && (key.color === undefined || item.color === key.color)));
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number; size?: string; color?: string }>) => {
      const { id, quantity, size, color } = action.payload;
      const nextQty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
      const existingItem = state.items.find((item) => item.id === id && (size === undefined || item.size === size) && (color === undefined || item.color === color));
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