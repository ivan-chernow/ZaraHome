import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "@/store/features/auth/auth.slice";
import { authApi } from "@/api/auth.api";
import { cartReducer } from "./features/cart/cart.slice";
import { navMenuReducer } from './features/catalog/navMenu.slice';
import catalogReducer from './features/catalog/catalog.slice';
import productCardReducer from './features/catalog/productCard.slice';
import { profileApi } from "@/api/profile.api";
import { productsApi } from "@/api/products.api";
import { promocodesApi } from '@/api/promocodes.api';
import { favoritesApi } from "@/api/favorites.api";
import favoritesReducer from "./features/favorites/favorites.slice";
import cartItemsReducer from './features/cart/cartItems.slice';
import { cartApi } from '@/api/cart.api';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    cartItems: cartItemsReducer,
    catalog: catalogReducer,
    auth: authReducer,
    navMenu: navMenuReducer,
    productCard: productCardReducer,
    favorites: favoritesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [promocodesApi.reducerPath]: promocodesApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      profileApi.middleware,
      promocodesApi.middleware,
      productsApi.middleware,
      favoritesApi.middleware,
      cartApi.middleware,
    ),
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
