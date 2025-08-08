import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItemsState {
  ids: number[];
}

const initialState: CartItemsState = {
  ids: [],
};

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
    addCartItem: (state, action: PayloadAction<number>) => {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setCartItems, addCartItem, removeCartItem } = cartItemsSlice.actions;
export default cartItemsSlice.reducer; 