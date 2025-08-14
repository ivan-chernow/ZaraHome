import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "@/features/auth/model/auth.slice";
import { authApi } from "@/features/auth/api/auth.api";
import { cartReducer } from "../../../entities/cart/model/cart.slice";
import { navMenuReducer } from '../../../widgets/nav-menu/model/navMenu.slice';
import catalogReducer from '../../../entities/category/model/catalog.slice';
import productCardReducer from '../../../entities/favorite/model/productCard.slice';
import { profileApi } from "@/entities/user/api/profile.api";
import { productsApi } from "@/entities/product/api/products.api";
import { promocodesApi } from '@/entities/promocode/api/promocodes.api';
import { favoritesApi } from "@/entities/favorite/api/favorites.api";
import favoritesReducer from "../../../entities/favorite/model/favorites.slice";
import cartItemsReducer from '../../../entities/cart/model/cartItems.slice';
import deliveryReducer from '../../../entities/user/model/delivery.slice';
import profileReducer from '../../../features/profile/model/profile.slice';
import adminReducer from '../../../features/admin/model/admin.slice';
import { cartApi } from '@/entities/cart/api/cart.api';
import { setLocalStorage } from "@/shared/lib/storage";

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
    admin: adminReducer,
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
