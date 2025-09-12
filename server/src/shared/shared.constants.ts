// Централизованные константы для всего приложения
export const APP_CONSTANTS = {
  // Настройки кеширования
  CACHE: {
    DEFAULT_TTL: 3600, // 1 час
    MAX_TTL: 86400, // 24 часа
    MIN_TTL: 60, // 1 минута
    CLEANUP_INTERVAL: 300000, // 5 минут
    MAX_KEYS: 10000,
    COMPRESSION_THRESHOLD: 1024, // 1KB
    PREFIXES: {
      PRODUCTS: 'products',
      CATEGORIES: 'categories',
      USERS: 'users',
      CART: 'cart',
      FAVORITES: 'favorites',
      ORDERS: 'orders',
      PROMOCODES: 'promocodes',
      SEARCH_RESULTS: 'search',
      USER_STATS: 'user_stats',
      USER_ADDRESSES: 'user_addresses',
    },
  },

  // Настройки изображений
  IMAGES: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MIN_DIMENSIONS: 50,
    MAX_DIMENSIONS: 8000,
    SUPPORTED_FORMATS: ['webp', 'jpeg', 'jpg', 'png'],
    DEFAULT_QUALITY: 78,
    MAX_QUALITY: 100,
    DEFAULT_MAX_WIDTH: 1600,
    DEFAULT_MAX_HEIGHT: 1600,
    DEFAULT_THUMBNAIL_SIZE: 300,
    COMPRESSION_EFFORT: 4,
    PNG_COMPRESSION_LEVEL: 9,
    DEFAULT_CLEANUP_AGE: 30 * 24 * 60 * 60 * 1000, // 30 дней
  },

  // Настройки загрузки файлов
  UPLOAD: {
    MAX_FILES: 10,
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_MIME_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    CHUNK_SIZE: 1024 * 1024, // 1MB
    RETRY_ATTEMPTS: 3,
    TIMEOUT: 30000, // 30 секунд
  },

  // Настройки безопасности
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 минут
    SESSION_TIMEOUT: 60 * 60 * 1000, // 1 час
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    RATE_LIMIT_WINDOW: 60 * 1000, // 1 минута
    RATE_LIMIT_MAX_REQUESTS: 100,
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  },

  // Настройки логирования
  LOGGING: {
    MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_LOG_FILES: 5,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENABLE_REQUEST_LOGGING: true,
    ENABLE_PERFORMANCE_LOGGING: true,
  },

  // Настройки мониторинга
  MONITORING: {
    HEALTH_CHECK_INTERVAL: 30 * 1000, // 30 секунд
    METRICS_COLLECTION_INTERVAL: 60 * 1000, // 1 минута
    ALERT_THRESHOLD: 0.9, // 90%
    MAX_ERROR_RATE: 0.05, // 5%
  },

  // Настройки валидации
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_ARRAY_LENGTH: 1000,
    MAX_OBJECT_KEYS: 100,
    EMAIL_MAX_LENGTH: 254,
    PHONE_MAX_LENGTH: 20,
    NAME_MAX_LENGTH: 100,
    ADDRESS_MAX_LENGTH: 500,
  },

  // Настройки пагинации
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
  },

  // Настройки поиска
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    DEFAULT_FUZZINESS: 0.3,
    MAX_RESULTS: 1000,
  },

  // Настройки пользователей
  USERS: {
    MIN_AGE: 13,
    MAX_AGE: 120,
    MAX_ADDRESSES: 10,
    MAX_FAVORITES: 1000,
    MAX_CART_ITEMS: 100,
  },

  // Настройки корзины
  CART: {
    MAX_ITEMS: 100,
    MAX_QUANTITY: 99,
    MIN_QUANTITY: 1,
    SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 дней
  },

  // Настройки заказов
  ORDERS: {
    MAX_ITEMS: 50,
    MIN_AMOUNT: 0,
    MAX_AMOUNT: 1000000,
    MAX_DELIVERY_DAYS: 30,
  },

  // Настройки промокодов
  PROMOCODES: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    MAX_USES: 10000,
    MAX_DISCOUNT: 100,
  },

  // Настройки продуктов
  PRODUCTS: {
    MAX_NAME_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_IMAGES: 10,
    MIN_PRICE: 0,
    MAX_PRICE: 1000000,
    MAX_SKU_LENGTH: 50,
  },

  // Настройки email
  EMAIL: {
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 5000, // 5 секунд
    MAX_RECIPIENTS: 100,
    TEMPLATE_CACHE_TTL: 3600, // 1 час
  },

  // Сообщения об ошибках
  ERRORS: {
    CACHE: {
      KEY_NOT_FOUND: 'Ключ кеша не найден',
      INVALID_TTL: 'Некорректное время жизни кеша',
      STORAGE_FULL: 'Кеш переполнен',
      OPERATION_FAILED: 'Операция с кешем не удалась',
    },
    IMAGE: {
      INVALID_FORMAT: 'Неподдерживаемый формат изображения',
      TOO_LARGE: 'Изображение слишком большое',
      TOO_SMALL: 'Изображение слишком маленькое',
      PROCESSING_FAILED: 'Обработка изображения не удалась',
      SAVE_FAILED: 'Сохранение изображения не удалось',
      VALIDATION_FAILED: 'Валидация изображения не удалась',
      THUMBNAIL_GENERATION_FAILED: 'Создание миниатюры не удалось',
      COMPRESSION_FAILED: 'Сжатие изображения не удалось',
      RESIZE_FAILED: 'Изменение размера изображения не удалось',
      FORMAT_CONVERSION_FAILED: 'Изменение формата изображения не удалось',
      METADATA_RETRIEVAL_FAILED: 'Получение метаданных изображения не удалось',
      DELETION_FAILED: 'Удаление изображения не удалось',
      CLEANUP_FAILED: 'Очистка старых изображений не удалась',
    },
    UPLOAD: {
      FILE_TOO_LARGE: 'Файл слишком большой',
      INVALID_TYPE: 'Неподдерживаемый тип файла',
      UPLOAD_FAILED: 'Загрузка файла не удалась',
      VALIDATION_FAILED: 'Валидация файла не удалась',
      STORAGE_FULL: 'Хранилище файлов переполнено',
    },
    VALIDATION: {
      INVALID_EMAIL: 'Некорректный email адрес',
      INVALID_PHONE: 'Некорректный номер телефона',
      INVALID_PASSWORD: 'Некорректный пароль',
      STRING_TOO_LONG: 'Строка слишком длинная',
      ARRAY_TOO_LONG: 'Массив слишком длинный',
      OBJECT_TOO_LARGE: 'Объект слишком большой',
    },
    AUTH: {
      INVALID_CREDENTIALS: 'Неверные учетные данные',
      TOKEN_EXPIRED: 'Токен истек',
      INSUFFICIENT_PERMISSIONS: 'Недостаточно прав',
      ACCOUNT_LOCKED: 'Аккаунт заблокирован',
      TOO_MANY_ATTEMPTS: 'Слишком много попыток входа',
    },
    USERS: {
      USER_NOT_FOUND: 'Пользователь не найден',
      EMAIL_ALREADY_EXISTS: 'Email уже используется',
      PHONE_ALREADY_EXISTS: 'Телефон уже используется',
      INVALID_AGE: 'Некорректный возраст',
      ADDRESS_LIMIT_EXCEEDED: 'Превышен лимит адресов',
    },
    CART: {
      ITEM_NOT_FOUND: 'Товар не найден в корзине',
      QUANTITY_EXCEEDED: 'Превышено максимальное количество',
      CART_FULL: 'Корзина переполнена',
      INVALID_QUANTITY: 'Некорректное количество',
    },
    FAVORITES: {
      ITEM_ALREADY_EXISTS: 'Товар уже в избранном',
      ITEM_NOT_FOUND: 'Товар не найден в избранном',
      LIMIT_EXCEEDED: 'Превышен лимит избранного',
    },
    ORDERS: {
      ORDER_NOT_FOUND: 'Заказ не найден',
      INVALID_STATUS: 'Некорректный статус заказа',
      CANNOT_CANCEL: 'Заказ нельзя отменить',
      INSUFFICIENT_STOCK: 'Недостаточно товара на складе',
    },
    PROMOCODES: {
      CODE_NOT_FOUND: 'Промокод не найден',
      CODE_EXPIRED: 'Промокод истек',
      CODE_INACTIVE: 'Промокод неактивен',
      USAGE_LIMIT_EXCEEDED: 'Превышен лимит использования',
      INVALID_AMOUNT: 'Некорректная сумма для промокода',
    },
    PRODUCTS: {
      PRODUCT_NOT_FOUND: 'Товар не найден',
      INVALID_PRICE: 'Некорректная цена',
      INVALID_CATEGORY: 'Некорректная категория',
      IMAGE_LIMIT_EXCEEDED: 'Превышен лимит изображений',
      SKU_ALREADY_EXISTS: 'SKU уже используется',
    },
    GENERAL: {
      DIRECTORY_CREATION_FAILED: 'Не удалось создать директории',
      INVALID_IMAGE: 'Некорректное изображение',
      INVALID_IMAGE_FORMAT: 'Некорректный формат изображения',
      IMAGE_PROCESSING_FAILED: 'Ошибка обработки изображения',
      OPERATION_FAILED: 'Операция не удалась',
      VALIDATION_FAILED: 'Валидация не удалась',
      NOT_FOUND: 'Ресурс не найден',
      UNAUTHORIZED: 'Доступ запрещен',
      FORBIDDEN: 'Доступ запрещен',
      INTERNAL_ERROR: 'Внутренняя ошибка сервера',
      DATABASE_ERROR: 'Ошибка базы данных',
      NETWORK_ERROR: 'Ошибка сети',
      TIMEOUT_ERROR: 'Превышено время ожидания',
    },
  },

  // Сообщения об успехе
  SUCCESS: {
    IMAGE: {
      PROCESSED: 'Изображение успешно обработано',
      SAVED: 'Изображение успешно сохранено',
      THUMBNAIL_CREATED: 'Миниатюра успешно создана',
      COMPRESSED: 'Изображение успешно сжато',
      RESIZED: 'Размер изображения успешно изменен',
      FORMAT_CHANGED: 'Формат изображения успешно изменен',
      DELETED: 'Изображение успешно удалено',
      CLEANUP_COMPLETED: 'Очистка старых изображений завершена',
    },
    UPLOAD: {
      FILE_UPLOADED: 'Файл успешно загружен',
      FILES_UPLOADED: 'Файлы успешно загружены',
      VALIDATION_PASSED: 'Валидация файла прошла успешно',
    },
    VALIDATION: {
      EMAIL_VALID: 'Email адрес корректен',
      PHONE_VALID: 'Номер телефона корректен',
      PASSWORD_VALID: 'Пароль корректен',
      STRING_VALID: 'Строка корректна',
      ARRAY_VALID: 'Массив корректен',
      OBJECT_VALID: 'Объект корректен',
    },
    AUTH: {
      LOGIN_SUCCESS: 'Вход выполнен успешно',
      LOGOUT_SUCCESS: 'Выход выполнен успешно',
      REGISTRATION_SUCCESS: 'Регистрация выполнена успешно',
      PASSWORD_CHANGED: 'Пароль успешно изменен',
      EMAIL_CHANGED: 'Email успешно изменен',
      TOKEN_REFRESHED: 'Токен успешно обновлен',
    },
    USERS: {
      PROFILE_UPDATED: 'Профиль успешно обновлен',
      ADDRESS_ADDED: 'Адрес успешно добавлен',
      ADDRESS_UPDATED: 'Адрес успешно обновлен',
      ADDRESS_DELETED: 'Адрес успешно удален',
    },
    CART: {
      ITEM_ADDED: 'Товар успешно добавлен в корзину',
      ITEM_UPDATED: 'Товар успешно обновлен',
      ITEM_REMOVED: 'Товар успешно удален из корзины',
      CART_CLEARED: 'Корзина успешно очищена',
    },
    FAVORITES: {
      ITEM_ADDED: 'Товар успешно добавлен в избранное',
      ITEM_REMOVED: 'Товар успешно удален из избранного',
      FAVORITES_CLEARED: 'Избранное успешно очищено',
    },
    ORDERS: {
      ORDER_CREATED: 'Заказ успешно создан',
      ORDER_UPDATED: 'Заказ успешно обновлен',
      ORDER_CANCELLED: 'Заказ успешно отменен',
      STATUS_CHANGED: 'Статус заказа успешно изменен',
    },
    PROMOCODES: {
      CODE_APPLIED: 'Промокод успешно применен',
      CODE_CREATED: 'Промокод успешно создан',
      CODE_UPDATED: 'Промокод успешно обновлен',
      CODE_DEACTIVATED: 'Промокод успешно деактивирован',
    },
    PRODUCTS: {
      PRODUCT_CREATED: 'Товар успешно создан',
      PRODUCT_UPDATED: 'Товар успешно обновлен',
      PRODUCT_DELETED: 'Товар успешно удален',
      IMAGES_UPLOADED: 'Изображения успешно загружены',
    },
  },

  // HTTP статусы
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Регулярные выражения
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-\(\)]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    ALPHABETIC: /^[a-zA-Z\s]+$/,
    NUMERIC: /^\d+$/,
    DECIMAL: /^\d+(\.\d+)?$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    SKU: /^[A-Z0-9\-_]+$/,
  },

  // Форматы дат
  DATE_FORMATS: {
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    HUMAN: 'DD.MM.YYYY HH:mm',
  },

  // Единицы измерения
  UNITS: {
    BYTES: {
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
    },
    TIME: {
      SECOND: 1000,
      MINUTE: 60 * 1000,
      HOUR: 60 * 60 * 1000,
      DAY: 24 * 60 * 60 * 1000,
    },
    CURRENCY: {
      RUB: 'RUB',
      USD: 'USD',
      EUR: 'EUR',
    },
  },

  // Настройки базы данных
  DATABASE: {
    MAX_CONNECTIONS: 20,
    CONNECTION_TIMEOUT: 30000,
    QUERY_TIMEOUT: 30000,
    MIGRATION_TIMEOUT: 60000,
  },

  // Настройки Redis
  REDIS: {
    DEFAULT_TTL: 3600,
    MAX_TTL: 86400,
    CONNECTION_TIMEOUT: 10000,
    COMMAND_TIMEOUT: 5000,
  },

  // Настройки очередей
  QUEUE: {
    DEFAULT_PRIORITY: 0,
    MAX_PRIORITY: 10,
    DEFAULT_DELAY: 0,
    MAX_DELAY: 86400000, // 24 часа
    DEFAULT_ATTEMPTS: 3,
    MAX_ATTEMPTS: 10,
  },
} as const;

// Типы для констант
export type CacheTTL = typeof APP_CONSTANTS.CACHE.DEFAULT_TTL;
export type ImageFormat =
  (typeof APP_CONSTANTS.IMAGES.SUPPORTED_FORMATS)[number];
export type MimeType = (typeof APP_CONSTANTS.UPLOAD.ALLOWED_MIME_TYPES)[number];
export type LogLevel = typeof APP_CONSTANTS.LOGGING.LOG_LEVEL;
export type HttpStatus =
  (typeof APP_CONSTANTS.HTTP_STATUS)[keyof typeof APP_CONSTANTS.HTTP_STATUS];
export type Currency =
  (typeof APP_CONSTANTS.UNITS.CURRENCY)[keyof typeof APP_CONSTANTS.UNITS.CURRENCY];

// Экспорт для обратной совместимости
export const SHARED_CONSTANTS = APP_CONSTANTS;
