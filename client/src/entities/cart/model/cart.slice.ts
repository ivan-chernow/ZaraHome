import { createSlice } from '@reduxjs/toolkit';

interface CartState {
  isOpenCart: boolean;
}

const initialState: CartState = {
  isOpenCart: false,
};

export const cartSlice = createSlice({
  name: 'cartModal',
  initialState,
  reducers: {
    toggleCart: (state): void => {
      state.isOpenCart = !state.isOpenCart;
    },
    closeCart: (state): void => {
      state.isOpenCart = false;
    },
  },
});

// Экспортируйте все действия
export const { toggleCart, closeCart } = cartSlice.actions;

// Экспортируйте редюсер
export const cartReducer = cartSlice.reducer;
