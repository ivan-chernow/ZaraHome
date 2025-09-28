import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { getLocalStorage } from '@/shared/lib/storage';

// Тип для элемента корзины
export interface CartItem {
  id: number;
  quantity: number;
  price: number; // Добавляем цену для подсчёта суммы
  img?: string; // Добавляем ссылку на картинку
  size?: string; // Выбранный размер
  color?: string; // Выбранный цвет
  name_eng?: string; // Название товара на английском
  name_ru?: string; // Название товара на русском
}

interface CartItemsState {
  items: CartItem[];
}

// Валидация элемента корзины
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    Number.isInteger(item.id) &&
    item.id > 0 &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0 &&
    Number.isInteger(item.quantity)
  );
};

const loadInitialCartItems = (): CartItem[] => {
  try {
    const raw = getLocalStorage('cart', []);
    if (!Array.isArray(raw)) return [];

    return raw.filter(isValidCartItem).map(i => ({
      id: i.id,
      price: i.price,
      quantity: Math.floor(i.quantity),
      img: typeof i.img === 'string' && i.img.trim() ? i.img : undefined,
      size: typeof i.size === 'string' && i.size.trim() ? i.size : undefined,
      color:
        typeof i.color === 'string' && i.color.trim() ? i.color : undefined,
      name_eng:
        typeof i.name_eng === 'string' && i.name_eng.trim()
          ? i.name_eng
          : undefined,
      name_ru:
        typeof i.name_ru === 'string' && i.name_ru.trim()
          ? i.name_ru
          : undefined,
    }));
  } catch (error) {
    console.error('Ошибка загрузки корзины из localStorage:', error);
    return [];
  }
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
    addCartItem: (
      state,
      action: PayloadAction<{
        id: number;
        price: number;
        img?: string;
        size?: string;
        color?: string;
        name_eng?: string;
        name_ru?: string;
      }>
    ) => {
      const { id, price, img, size, color, name_eng, name_ru } = action.payload;
      const existingItem = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id,
          quantity: 1,
          price,
          img,
          size,
          color,
          name_eng,
          name_ru,
        });
      }
    },
    removeCartItem: (
      state,
      action: PayloadAction<
        number | { id: number; size?: string; color?: string }
      >
    ) => {
      const key =
        typeof action.payload === 'number'
          ? { id: action.payload }
          : action.payload;
      const existingItem = state.items.find(
        item =>
          item.id === key.id &&
          (key.size === undefined || item.size === key.size) &&
          (key.color === undefined || item.color === key.color)
      );
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(
            item =>
              !(
                item.id === key.id &&
                (key.size === undefined || item.size === key.size) &&
                (key.color === undefined || item.color === key.color)
              )
          );
        }
      }
    },
    deleteCartItem: (
      state,
      action: PayloadAction<
        number | { id: number; size?: string; color?: string }
      >
    ) => {
      const key =
        typeof action.payload === 'number'
          ? { id: action.payload }
          : action.payload;
      state.items = state.items.filter(
        item =>
          !(
            item.id === key.id &&
            (key.size === undefined || item.size === key.size) &&
            (key.color === undefined || item.color === key.color)
          )
      );
    },
    clearCart: state => {
      state.items = [];
    },
    setCartItemQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
        size?: string;
        color?: string;
      }>
    ) => {
      const { id, quantity, size, color } = action.payload;
      const nextQty =
        Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
      const existingItem = state.items.find(
        item =>
          item.id === id &&
          (size === undefined || item.size === size) &&
          (color === undefined || item.color === color)
      );
      if (existingItem) {
        existingItem.quantity = nextQty;
      }
    },
  },
});

// Селекторы с мемоизацией

export const selectCartItems = (state: { cartItems: CartItemsState }) =>
  state.cartItems.items;

export const selectCartTotalCount = createSelector([selectCartItems], items =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector([selectCartItems], items =>
  items.reduce((sum, item) => sum + item.quantity * item.price, 0)
);

// Дополнительные селекторы для оптимизации
export const selectCartItemById = createSelector(
  [selectCartItems, (state: any, id: number) => id],
  (items, id) => items.find(item => item.id === id)
);

export const selectCartItemsByProductId = createSelector(
  [selectCartItems, (state: any, productId: number) => productId],
  (items, productId) => items.filter(item => item.id === productId)
);

export const {
  setCartItems,
  addCartItem,
  removeCartItem,
  deleteCartItem,
  clearCart,
  setCartItemQuantity,
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer;
