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
import deliveryReducer from './features/delivery/delivery.slice';
import profileReducer from './features/profile/profile.slice';
import { cartApi } from '@/api/cart.api';
import { setLocalStorage } from "@/utils/storage";

// Утилита для санитарной очистки структуры корзины
const sanitizeCartItems = (raw: any): any[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && typeof i.id === "number" && typeof i.price === "number")
    .map((i) => ({
      id: i.id,
      price: i.price,
      img: typeof i.img === "string" ? i.img : undefined,
      quantity:
        typeof i.quantity === "number" && Number.isFinite(i.quantity) && i.quantity > 0
          ? i.quantity
          : 1,
    }));
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    cartItems: cartItemsReducer,
    catalog: catalogReducer,
    auth: authReducer,
    navMenu: navMenuReducer,
    productCard: productCardReducer,
    favorites: favoritesReducer,
    delivery: deliveryReducer,
    profile: profileReducer,
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

// Подписка для сохранения корзины в localStorage при изменениях
store.subscribe(() => {
  const state = store.getState();
  const items = state.cartItems?.items ?? [];
  setLocalStorage("cart", sanitizeCartItems(items));
});
