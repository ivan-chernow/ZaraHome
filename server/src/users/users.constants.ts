export const USERS_CONSTANTS = {
  // Настройки пагинации
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,

  // Настройки поиска
  MIN_SEARCH_QUERY_LENGTH: 2,
  MAX_SEARCH_QUERY_LENGTH: 100,

  // Настройки валидации
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_ADDRESS_LENGTH: 500,
  MAX_PHONE_LENGTH: 20,

  // Настройки кеширования
  CACHE_TTL: {
    USER_PROFILE: 300, // 5 минут
    USER_ADDRESSES: 600, // 10 минут
    USER_STATS: 1800, // 30 минут
    SEARCH_RESULTS: 300, // 5 минут
  },

  // Сообщения об успехе
  SUCCESS: {
    PROFILE_UPDATED: 'Профиль успешно обновлен',
    PASSWORD_CHANGED: 'Пароль успешно изменен',
    EMAIL_CHANGED: 'Email успешно изменен',
    ADDRESS_ADDED: 'Адрес доставки добавлен',
    ADDRESS_UPDATED: 'Адрес доставки обновлен',
    ADDRESS_DELETED: 'Адрес доставки удален',
    USER_CREATED: 'Пользователь успешно создан',
    USER_UPDATED: 'Пользователь успешно обновлен',
    USER_DELETED: 'Пользователь успешно удален',
    SEARCH_COMPLETED: 'Поиск завершен',
  },

  // Сообщения об ошибках
  ERRORS: {
    USER_NOT_FOUND: 'Пользователь не найден',
    EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
    INVALID_CURRENT_PASSWORD: 'Неверный текущий пароль',
    PASSWORDS_DO_NOT_MATCH: 'Пароли не совпадают',
    INVALID_EMAIL_FORMAT: 'Неверный формат email',
    INVALID_PHONE_FORMAT: 'Неверный формат номера телефона',
    ADDRESS_NOT_FOUND: 'Адрес доставки не найден',
    ADDRESS_TOO_LONG: 'Адрес слишком длинный',
    NAME_TOO_LONG: 'Имя слишком длинное',
    EMAIL_TOO_LONG: 'Email слишком длинный',
    PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов',
    PASSWORD_TOO_LONG: 'Пароль слишком длинный',
    INVALID_PAGINATION: 'Некорректные параметры пагинации',
    SEARCH_QUERY_TOO_SHORT:
      'Поисковый запрос должен содержать минимум 2 символа',
    SEARCH_QUERY_TOO_LONG: 'Поисковый запрос слишком длинный',
    UNAUTHORIZED_ACCESS: 'Недостаточно прав для выполнения операции',
    INVALID_USER_DATA: 'Некорректные данные пользователя',
  },

  // Настройки ролей
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },

  // Настройки статусов
  STATUSES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING_VERIFICATION: 'pending_verification',
  },

  // Настройки фильтров
  FILTERS: {
    DEFAULT_SORT_FIELD: 'createdAt',
    DEFAULT_SORT_ORDER: 'DESC',
    ALLOWED_SORT_FIELDS: [
      'id',
      'email',
      'firstName',
      'lastName',
      'createdAt',
      'updatedAt',
    ],
    ALLOWED_SORT_ORDERS: ['ASC', 'DESC'],
  },

  // Настройки безопасности
  SECURITY: {
    PASSWORD_HASH_ROUNDS: 12,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900, // 15 минут
    SESSION_TIMEOUT: 3600, // 1 час
  },
} as const;
