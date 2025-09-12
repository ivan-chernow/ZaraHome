export const EMAIL_CONSTANTS = {
  // Retry настройки
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 секунда

  // Rate limiting
  RATE_LIMIT_WINDOW: 60000, // 1 минута
  RATE_LIMIT_MAX_EMAILS: 10, // максимум 10 email в минуту

  // Валидация
  MAX_EMAIL_LENGTH: 254,
  MAX_SUBJECT_LENGTH: 200,

  // Сообщения об ошибках
  ERRORS: {
    INVALID_EMAIL: 'Неверный формат email адреса',
    INVALID_SUBJECT: 'Тема письма не может быть пустой',
    INVALID_TEMPLATE: 'Неверный шаблон письма',
    TEMPLATE_NOT_FOUND: 'Шаблон не найден',
    MISSING_REQUIRED_FIELD: (field: string) =>
      `Отсутствует обязательное поле: ${field}`,
    SEND_FAILED: 'Ошибка при отправке письма: ',
    RATE_LIMIT_EXCEEDED: 'Превышен лимит отправки писем. Попробуйте позже',
    SERVICE_NOT_CONFIGURED: 'Email сервис не настроен',
  },

  // Сообщения об успехе
  SUCCESS: {
    EMAIL_SENT: 'Письмо отправлено успешно',
    TEMPLATE_CACHED: 'Шаблон закеширован',
    METRICS_RESET: 'Метрики сброшены',
  },

  // Типы шаблонов
  TEMPLATE_TYPES: {
    VERIFICATION: 'verification',
    WELCOME: 'welcome',
    RESET_PASSWORD: 'resetPassword',
  },

  // Настройки логирования
  LOGGING: {
    SUCCESS_PREFIX: '✅',
    ERROR_PREFIX: '❌',
    WARNING_PREFIX: '⚠️',
  },
} as const;

export const EMAIL_TYPES = {
  // Статусы отправки
  SEND_STATUS: {
    SUCCESS: 'success',
    FAILED: 'failed',
    PENDING: 'pending',
  },

  // Типы ошибок
  ERROR_TYPES: {
    VALIDATION: 'validation',
    TEMPLATE: 'template',
    SEND: 'send',
    RATE_LIMIT: 'rate_limit',
  },
} as const;
