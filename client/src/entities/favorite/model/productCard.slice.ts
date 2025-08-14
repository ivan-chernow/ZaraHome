import { createSlice } from "@reduxjs/toolkit";

interface ProductColors {
    [productId: number]: string;
}

const initialState: { activeColors: ProductColors } = {
    activeColors: {},
}   

const productCardSlice = createSlice({
    name: 'productCard',
    initialState,
    reducers: {
        setActiveColor: (state, action: { payload: { productId: number, color: string } }) => {
            state.activeColors[action.payload.productId] = action.payload.color;
        },
    },
});

export const { setActiveColor } = productCardSlice.actions;
export default productCardSlice.reducer;

