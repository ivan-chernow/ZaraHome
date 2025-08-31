// Константы для модуля Shared
export const SHARED_CONSTANTS = {
  // Настройки кеширования
  CACHE: {
    DEFAULT_TTL: 3600, // 1 час
    MAX_TTL: 86400, // 24 часа
    MIN_TTL: 60, // 1 минута
    CLEANUP_INTERVAL: 300000, // 5 минут
    MAX_KEYS: 10000,
    COMPRESSION_THRESHOLD: 1024, // 1KB
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
  },
} as const;

// Типы для констант
export type CacheTTL = typeof SHARED_CONSTANTS.CACHE.DEFAULT_TTL;
export type ImageFormat = typeof SHARED_CONSTANTS.IMAGES.SUPPORTED_FORMATS[number];
export type MimeType = typeof SHARED_CONSTANTS.UPLOAD.ALLOWED_MIME_TYPES[number];
export type LogLevel = typeof SHARED_CONSTANTS.LOGGING.LOG_LEVEL;
export type HttpStatus = typeof SHARED_CONSTANTS.HTTP_STATUS[keyof typeof SHARED_CONSTANTS.HTTP_STATUS];
