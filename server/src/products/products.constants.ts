/**
 * Константы для Products модуля
 */

export const PRODUCTS_CONSTANTS = {
  // Пагинация
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Batch операции
  MAX_BATCH_SIZE: 50,
  MIN_BATCH_SIZE: 1,

  // Валидация
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MIN_PRICE: 0,
  MAX_PRICE: 1000000,

  // Сообщения об ошибках
  ERRORS: {
    NO_VALID_FILES: 'Нет валидных файлов для загрузки',
    UPLOAD_FAILED: 'Не удалось загрузить ни одного изображения',
    CATEGORY_NOT_FOUND: 'Категория не найдена',
    SUB_CATEGORY_NOT_FOUND: 'Подкатегория не найдена',
    TYPE_NOT_FOUND: 'Тип не найден',
    INVALID_NAME_ENG: 'Название на английском должно содержать минимум 2 символа',
    INVALID_NAME_RU: 'Название на русском должно содержать минимум 2 символа',
    INVALID_SIZE: 'Размеры должны быть указаны',
    INVALID_SIZE_ITEM: 'Каждый размер должен содержать название и цену больше 0',
    INVALID_COLORS: 'Цвета должны быть указаны',
    UPDATE_FAILED: 'Не удалось обновить продукт',
    NO_IDS_PROVIDED: 'Не указаны ID для удаления',
    BATCH_SIZE_EXCEEDED: 'Максимум 50 товаров за раз',
    SEARCH_TOO_SHORT: 'Поисковый запрос должен содержать минимум 2 символа',
  },

  // Сообщения об успехе
  SUCCESS: {
    PRODUCT_CREATED: 'Продукт успешно создан',
    PRODUCT_UPDATED: 'Продукт успешно обновлен',
    PRODUCT_DELETED: 'Продукт успешно удален',
    PRODUCTS_DELETED: 'Продукты успешно удалены',
    CATALOG_LOADED: 'Каталог успешно загружен',
    PRODUCTS_LOADED: 'Продукты успешно загружены',
    SEARCH_COMPLETED: 'Поиск завершен',
  },

  // Сортировка
  SORT_FIELDS: {
    PRICE: 'price',
    CREATED_AT: 'createdAt',
    NAME_RU: 'name_ru',
    DISCOUNT: 'discount',
  },

  SORT_ORDERS: {
    ASC: 'ASC',
    DESC: 'DESC',
  },

  // Фильтры
  FILTERS: {
    CATEGORY_ID: 'categoryId',
    SUB_CATEGORY_ID: 'subCategoryId',
    TYPE_ID: 'typeId',
    MIN_PRICE: 'minPrice',
    MAX_PRICE: 'maxPrice',
    IS_NEW: 'isNew',
    HAS_DISCOUNT: 'hasDiscount',
    IS_AVAILABLE: 'isAvailable',
    SEARCH: 'search',
  },

  // Кеш ключи
  CACHE_KEYS: {
    ALL_PRODUCTS: 'all_products',
    PRODUCT_BY_ID: (id: number) => `product:${id}`,
    PRODUCTS_FILTERED: (filters: any) => `products:filtered:${JSON.stringify(filters)}`,
    SEARCH_RESULTS: (query: string) => `search:${query}`,
    PRODUCT_STATS: 'product_stats',
  },

  // Валидация
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 2000,
    PRICE_MIN: 0,
    PRICE_MAX: 1000000,
    DISCOUNT_MIN: 0,
    DISCOUNT_MAX: 100,
  },
} as const;

/**
 * Типы для Products модуля
 */
export const PRODUCTS_TYPES = {
  // Статусы продуктов
  PRODUCT_STATUS: {
    AVAILABLE: true,
    UNAVAILABLE: false,
  },

  // Типы сортировки
  SORT_TYPES: {
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    DATE_ASC: 'date_asc',
    DATE_DESC: 'date_desc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    DISCOUNT_DESC: 'discount_desc',
  },

  // Типы фильтров
  FILTER_TYPES: {
    CATEGORY: 'category',
    PRICE_RANGE: 'price_range',
    AVAILABILITY: 'availability',
    NEW_PRODUCTS: 'new_products',
    DISCOUNTED: 'discounted',
  },
} as const;
