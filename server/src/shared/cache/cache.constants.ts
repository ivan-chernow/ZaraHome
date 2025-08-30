// Константы для кеширования
export const CACHE_TTL = {
  // Каталог и категории (изменяются редко)
  CATALOG: 3600, // 1 час
  CATEGORIES: 7200, // 2 часа
  PRODUCTS: 1800, // 30 минут
  
  // Изображения (изменяются при обновлении продукта)
  IMAGES: 86400, // 1 день
  THUMBNAILS: 86400, // 1 день
  
  // Пользовательские данные (изменяются часто)
  USER_CART: 1800, // 30 минут
  USER_FAVORITES: 3600, // 1 час
  USER_PROFILE: 1800, // 30 минут
  USER: 1800, // 30 минут
  ORDERS: 1800, // 30 минут
  
  // Справочники (изменяются редко)
  PROMOCODES: 900, // 15 минут
  DELIVERY_OPTIONS: 7200, // 2 часа
  
  // Временные данные
  SESSION: 1800, // 30 минут
  RATE_LIMIT: 60, // 1 минута
  
  // Поиск и статистика
  SEARCH: 900, // 15 минут
  STATS: 1800, // 30 минут
} as const;

export const CACHE_PREFIXES = {
  CATALOG: 'catalog',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  IMAGES: 'images',
  THUMBNAILS: 'thumbnails',
  USER_CART: 'cart',
  USER_FAVORITES: 'favorites',
  USER_PROFILE: 'profile',
  USER: 'user',
  ORDERS: 'orders',
  PROMOCODES: 'promocodes',
  DELIVERY: 'delivery',
  SESSION: 'session',
  SEARCH: 'search',
  STATS: 'stats',
} as const;

export const CACHE_KEYS = {
  // Каталог
  ALL_CATEGORIES: 'all',
  CATEGORY_BY_ID: 'by-id',
  SUB_CATEGORIES: 'sub-categories',
  TYPES: 'types',
  
  // Продукты
  ALL_PRODUCTS: 'all',
  PRODUCT_BY_ID: 'by-id',
  NEW_PRODUCTS: 'new',
  DISCOUNTED_PRODUCTS: 'discounted',
  PRODUCTS_BY_CATEGORY: 'by-category',
  
  // Изображения
  PRODUCT_IMAGES: 'product',
  THUMBNAIL: 'thumb',
  
  // Пользователи
  USER_CART: 'user',
  USER_FAVORITES: 'user',
  USER_PROFILE: 'user',
  
  // Справочники
  ACTIVE_PROMOCODES: 'active',
  DELIVERY_OPTIONS: 'options',
} as const;
