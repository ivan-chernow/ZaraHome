import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@/shared/config/store/store';

/**
 * Селекторы для предотвращения лишних ререндеров
 */

// Селектор для аутентификации
export const useAuthSelector = () => {
  return useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    isOpenAuth: state.auth.isOpenAuth,
  }), shallowEqual);
};

// Селектор для корзины с мемоизацией вычислений
export const useCartSelector = () => {
  return useSelector((state: RootState) => {
    const items = state.cartItems.items;
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return { items, totalCount, totalPrice };
  }, shallowEqual);
};

// Селектор для навигационного меню
export const useNavMenuSelector = () => {
  return useSelector((state: RootState) => state.navMenu, shallowEqual);
};

// Селектор для каталога
export const useCatalogSelector = () => {
  return useSelector((state: RootState) => ({
    categories: state.catalog.categories,
    expandedCategories: state.catalog.expandedCategories,
    expandedSubCategories: state.catalog.expandedSubCategories,
  }), shallowEqual);
};

// Селектор для профиля
export const useProfileSelector = () => {
  return useSelector((state: RootState) => ({
    activeView: state.profile.activeView,
  }), shallowEqual);
};

// Селектор для заказов
export const useOrderSelector = () => {
  return useSelector((state: RootState) => ({
    currentOrder: state.order.currentOrder,
    currentTotalOverride: state.order.currentTotalOverride,
  }), shallowEqual);
};

// Селектор для доставки
export const useDeliverySelector = () => {
  return useSelector((state: RootState) => ({
    selectedAddress: state.delivery.selectedAddress,
  }), shallowEqual);
};

// Селектор для избранного
export const useFavoritesSelector = () => {
  return useSelector((state: RootState) => ({
    items: state.favorites.items,
    activeColors: state.productCard.activeColors,
  }), shallowEqual);
};

// Селектор для активного цвета продукта
export const useProductColorSelector = (productId: number) => {
  return useSelector(
    (state: RootState) => state.productCard.activeColors[productId],
    (left, right) => left === right
  );
};

// Селектор для состояния корзины
export const useCartStateSelector = () => {
  return useSelector((state: RootState) => state.cart, shallowEqual);
};
