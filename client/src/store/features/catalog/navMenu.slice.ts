import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavMenuState {
    isOpenAllProducts: boolean;
    isOpenDiscounts: boolean;
    isOpenNewProducts: boolean;
    isOpenInformation: boolean;
    isOpenSearch: boolean;
}

const initialState: NavMenuState = {
    isOpenAllProducts: false,
    isOpenDiscounts: false,
    isOpenNewProducts: false,
    isOpenInformation: false,
    isOpenSearch: false
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
            state.isOpenSearch = false;
        },
        toggleDiscounts: (state, action: PayloadAction<boolean>) => {
            state.isOpenDiscounts = action.payload;
            state.isOpenAllProducts = false;
            state.isOpenNewProducts = false;
            state.isOpenInformation = false;
            state.isOpenSearch = false;
        },
        toggleNewProducts: (state, action: PayloadAction<boolean>) => {
            state.isOpenNewProducts = action.payload;
            state.isOpenAllProducts = false;
            state.isOpenDiscounts = false;
            state.isOpenInformation = false;
            state.isOpenSearch = false;
        },
        toggleInformation: (state, action: PayloadAction<boolean>) => {
            state.isOpenInformation = action.payload;
            state.isOpenAllProducts = false;
            state.isOpenDiscounts = false;
            state.isOpenNewProducts = false;
            state.isOpenSearch = false;
        },
        toggleSearch: (state, action: PayloadAction<boolean>) => {
            state.isOpenSearch = action.payload;
            state.isOpenAllProducts = false;
            state.isOpenDiscounts = false;
            state.isOpenNewProducts = false;
            state.isOpenInformation = false;
        },
        closeAllMenus: (state) => {
            state.isOpenAllProducts = false;
            state.isOpenDiscounts = false;
            state.isOpenNewProducts = false;
            state.isOpenInformation = false;
            state.isOpenSearch = false;
        }
    }
});

export const {
    toggleAllProducts,
    toggleDiscounts,
    toggleNewProducts,
    toggleInformation,
    toggleSearch,
    closeAllMenus
} = navMenuSlice.actions;

export const navMenuReducer = navMenuSlice.reducer;


