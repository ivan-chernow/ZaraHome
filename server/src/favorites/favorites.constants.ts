/**
 * Константы для Favorites модуля
 */

export const FAVORITES_CONSTANTS = {
  // Лимиты для batch операций
  MAX_BATCH_SIZE: 50,
  MIN_BATCH_SIZE: 1,

  // Сообщения об ошибках
  ERRORS: {
    USER_NOT_FOUND: 'Пользователь не найден',
    PRODUCT_NOT_FOUND: 'Товар не найден',
    FAVORITE_ITEM_NOT_FOUND: 'Товар не найден в избранном',
    INVALID_USER_ID: 'User ID обязателен',
    INVALID_PRODUCT_ID: 'Product ID обязателен',
    INVALID_PRODUCT_IDS: 'Список Product ID обязателен',
    NO_VALID_PRODUCTS: 'Нет валидных Product ID',
    BATCH_SIZE_EXCEEDED: 'Максимум 50 товаров за раз',
    EMPTY_BATCH: 'Должен быть указан хотя бы один товар',
  },

  // Сообщения об успехе
  SUCCESS: {
    ITEM_ADDED: 'Товар добавлен в избранное',
    ITEMS_ADDED: 'Товары добавлены в избранное',
    ITEM_REMOVED: 'Товар удален из избранного',
    ITEMS_REMOVED: 'Товары удалены из избранного',
    FAVORITES_CLEARED: 'Избранное очищено',
    FAVORITES_LOADED: 'Избранное загружено',
    COUNT_LOADED: 'Количество товаров получено',
    STATUS_LOADED: 'Статус избранного получен',
  },

  // Кеш ключи
  CACHE_KEYS: {
    USER_FAVORITES: (userId: number) => `favorites:${userId}`,
    USER_FAVORITES_COUNT: (userId: number) => `favorites:count:${userId}`,
  },

  // Валидация
  VALIDATION: {
    PRODUCT_ID_MIN: 1,
    USER_ID_MIN: 1,
  },
} as const;

/**
 * Типы для Favorites модуля
 */
export const FAVORITES_TYPES = {
  // Статусы товаров в избранном
  FAVORITE_STATUS: {
    IN_FAVORITES: true,
    NOT_IN_FAVORITES: false,
  },
} as const;
