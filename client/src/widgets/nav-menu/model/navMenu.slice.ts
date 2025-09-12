import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavMenuState {
  isOpenAllProducts: boolean;
  isOpenDiscounts: boolean;
  isOpenNewProducts: boolean;
  isOpenInformation: boolean;
}

const initialState: NavMenuState = {
  isOpenAllProducts: false,
  isOpenDiscounts: false,
  isOpenNewProducts: false,
  isOpenInformation: false,
};

export const navMenuSlice = createSlice({
  name: 'navMenu',
  initialState,
  reducers: {
    toggleAllProducts: (state, action: PayloadAction<boolean>) => {
      state.isOpenAllProducts = action.payload;
      state.isOpenDiscounts = false;
      state.isOpenNewProducts = false;
      state.isOpenInformation = false;
    },
    toggleDiscounts: (state, action: PayloadAction<boolean>) => {
      state.isOpenDiscounts = action.payload;
      state.isOpenAllProducts = false;
      state.isOpenNewProducts = false;
      state.isOpenInformation = false;
    },
    toggleNewProducts: (state, action: PayloadAction<boolean>) => {
      state.isOpenNewProducts = action.payload;
      state.isOpenAllProducts = false;
      state.isOpenDiscounts = false;
      state.isOpenInformation = false;
    },
    toggleInformation: (state, action: PayloadAction<boolean>) => {
      state.isOpenInformation = action.payload;
      state.isOpenAllProducts = false;
      state.isOpenDiscounts = false;
      state.isOpenNewProducts = false;
    },
    closeAllMenus: state => {
      state.isOpenAllProducts = false;
      state.isOpenDiscounts = false;
      state.isOpenNewProducts = false;
      state.isOpenInformation = false;
    },
  },
});

export const {
  toggleAllProducts,
  toggleDiscounts,
  toggleNewProducts,
  toggleInformation,
  closeAllMenus,
} = navMenuSlice.actions;

export const navMenuReducer = navMenuSlice.reducer;
