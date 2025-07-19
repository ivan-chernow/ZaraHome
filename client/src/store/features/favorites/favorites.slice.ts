import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/api/products.api';

interface FavoritesState {
    ids: number[];
}

const initialState: FavoritesState = {
    ids: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<Product[]>) => {
            state.ids = action.payload.map(p => p.id);
        },
        addFavorite: (state, action: PayloadAction<number>) => {
            if (!state.ids.includes(action.payload)) {
                state.ids.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.ids = state.ids.filter(id => id !== action.payload);
        },
    },
});

export const { setFavorites, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
