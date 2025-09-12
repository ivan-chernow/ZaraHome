/**
 * Константы для Promocodes модуля
 */

export const PROMOCODES_CONSTANTS = {
  // Пагинация
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Batch операции
  MAX_BATCH_SIZE: 50,
  MIN_BATCH_SIZE: 1,

  // Валидация
  MIN_CODE_LENGTH: 3,
  MAX_CODE_LENGTH: 20,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 50,
  MIN_DISCOUNT: 1,
  MAX_DISCOUNT: 100,
  MIN_ORDER_AMOUNT: 0,
  MAX_ORDER_AMOUNT: 1000000,

  // Сообщения об ошибках
  ERRORS: {
    INVALID_CODE: 'Код промокода должен содержать минимум 3 символа',
    CODE_TOO_LONG: 'Код промокода слишком длинный',
    CODE_ALREADY_EXISTS: 'Промокод с таким кодом уже существует',
    PROMOCODE_NOT_FOUND: 'Промокод не найден',
    PROMOCODE_EXPIRED: 'Промокод истек',
    INVALID_DISCOUNT: 'Скидка должна быть от 1 до 100 процентов',
    INVALID_ORDER_AMOUNT: 'Сумма заказа должна быть больше 0',
    INVALID_MIN_ORDER_AMOUNT:
      'Минимальная сумма заказа не может быть отрицательной',
    INVALID_MAX_USAGE:
      'Максимальное количество использований должно быть больше 0',
    CURRENT_USAGE_EXCEEDS_MAX: 'Текущее использование превышает максимальное',
    USAGE_LIMIT_EXCEEDED: 'Лимит использования промокода исчерпан',
    MIN_ORDER_AMOUNT: (amount: number) =>
      `Минимальная сумма заказа: ${amount} руб.`,
    INVALID_EXPIRY_DATE: 'Дата истечения должна быть в будущем',
    SEARCH_TOO_SHORT: 'Поисковый запрос должен содержать минимум 2 символа',
    NO_CODES_PROVIDED: 'Не указаны коды для деактивации',
    BATCH_SIZE_EXCEEDED: 'Максимум 50 промокодов за раз',
  },

  // Сообщения об успехе
  SUCCESS: {
    PROMOCODE_CREATED: 'Промокод успешно создан',
    PROMOCODE_UPDATED: 'Промокод успешно обновлен',
    PROMOCODE_DEACTIVATED: 'Промокод успешно деактивирован',
    PROMOCODES_DEACTIVATED: 'Промокоды успешно деактивированы',
    PROMOCODE_APPLIED: 'Промокод успешно применен',
    PROMOCODES_LOADED: 'Промокоды успешно загружены',
    SEARCH_COMPLETED: 'Поиск завершен',
  },

  // Типы промокодов
  PROMOCODE_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED_AMOUNT: 'fixed_amount',
    FREE_SHIPPING: 'free_shipping',
  },

  // Статусы промокодов
  PROMOCODE_STATUS: {
    ACTIVE: true,
    INACTIVE: false,
    EXPIRED: 'expired',
    USAGE_LIMIT_REACHED: 'usage_limit_reached',
  },

  // Кеш ключи
  CACHE_KEYS: {
    ALL_PROMOCODES: 'all_promocodes',
    ACTIVE_PROMOCODES: 'active_promocodes',
    PROMOCODE_BY_CODE: (code: string) => `promocode:${code}`,
    PROMOCODES_FILTERED: (filters: any) =>
      `promocodes:filtered:${JSON.stringify(filters)}`,
    SEARCH_RESULTS: (query: string) => `search:${query}`,
    PROMOCODE_STATS: 'promocode_stats',
  },

  // Валидация
  VALIDATION: {
    CODE_MIN_LENGTH: 3,
    CODE_MAX_LENGTH: 20,
    DISCOUNT_MIN: 1,
    DISCOUNT_MAX: 100,
    ORDER_AMOUNT_MIN: 0,
    ORDER_AMOUNT_MAX: 1000000,
    MAX_USAGE_MIN: 1,
    MAX_USAGE_MAX: 1000000,
  },

  // Настройки по умолчанию
  DEFAULTS: {
    MAX_USAGE: null, // без ограничений
    MIN_ORDER_AMOUNT: 0,
    EXPIRES_AT: null, // без срока действия
    DESCRIPTION: null,
  },
} as const;

/**
 * Типы для Promocodes модуля
 */
export const PROMOCODES_TYPES = {
  // Статусы промокодов
  PROMOCODE_STATUS: {
    ACTIVE: true,
    INACTIVE: false,
  },

  // Типы скидок
  DISCOUNT_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
  },

  // Типы ограничений
  LIMIT_TYPES: {
    USAGE_COUNT: 'usage_count',
    TIME_LIMIT: 'time_limit',
    ORDER_AMOUNT: 'order_amount',
  },
} as const;
