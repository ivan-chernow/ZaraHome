/**
 * Константы для Cart модуля
 */

export const CART_CONSTANTS = {
  // Лимиты для batch операций
  MAX_BATCH_SIZE: 50,
  MIN_BATCH_SIZE: 1,

  // Сообщения об ошибках
  ERRORS: {
    USER_NOT_FOUND: 'Пользователь не найден',
    PRODUCT_NOT_FOUND: 'Товар не найден',
    CART_ITEM_NOT_FOUND: 'Товар не найден в корзине',
    INVALID_USER_ID: 'User ID обязателен',
    INVALID_PRODUCT_ID: 'Product ID обязателен',
    INVALID_PRODUCT_IDS: 'Список Product ID обязателен',
    NO_VALID_PRODUCTS: 'Нет валидных Product ID',
    BATCH_SIZE_EXCEEDED: 'Максимум 50 товаров за раз',
    EMPTY_BATCH: 'Должен быть указан хотя бы один товар',
  },

  // Сообщения об успехе
  SUCCESS: {
    ITEM_ADDED: 'Товар добавлен в корзину',
    ITEMS_ADDED: 'Товары добавлены в корзину',
    ITEM_REMOVED: 'Товар удален из корзины',
    ITEMS_REMOVED: 'Товары удалены из корзины',
    CART_CLEARED: 'Корзина очищена',
    CART_LOADED: 'Корзина загружена',
    COUNT_LOADED: 'Количество товаров получено',
    STATUS_LOADED: 'Статус корзины получен',
  },

  // Кеш ключи
  CACHE_KEYS: {
    USER_CART: (userId: number) => `cart:${userId}`,
    USER_CART_COUNT: (userId: number) => `cart:count:${userId}`,
  },

  // Валидация
  VALIDATION: {
    PRODUCT_ID_MIN: 1,
    USER_ID_MIN: 1,
  },
} as const;

/**
 * Типы для Cart модуля
 */
export const CART_TYPES = {
  // Статусы товаров в корзине
  CART_STATUS: {
    IN_CART: true,
    NOT_IN_CART: false,
  },
} as const;
