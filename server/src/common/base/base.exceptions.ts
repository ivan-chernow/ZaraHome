import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Базовый класс для бизнес-логики исключений
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(
      {
        message,
        code,
        details,
        timestamp: new Date().toISOString(),
      },
      status
    );
  }
}

/**
 * Исключение для не найденных ресурсов
 */
export class ResourceNotFoundException extends BusinessException {
  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} с ID ${id} не найден`
      : `${resource} не найден`;
    
    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }
}

/**
 * Исключение для конфликтов (дублирование, нарушение ограничений)
 */
export class ConflictException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', details);
  }
}

/**
 * Исключение для неавторизованных запросов
 */
export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'Необходима авторизация') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

/**
 * Исключение для запрещенных действий
 */
export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Доступ запрещен') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

/**
 * Исключение для неверных данных
 */
export class ValidationException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

/**
 * Исключение для внутренних ошибок сервера
 */
export class InternalServerException extends BusinessException {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
  }
}

/**
 * Исключение для временно недоступных сервисов
 */
export class ServiceUnavailableException extends BusinessException {
  constructor(message: string = 'Сервис временно недоступен') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * Исключение для превышения лимитов
 */
export class LimitExceededException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'LIMIT_EXCEEDED', details);
  }
}

/**
 * Исключение для устаревших версий API
 */
export class DeprecatedApiException extends BusinessException {
  constructor(message: string = 'Версия API устарела') {
    super(message, HttpStatus.GONE, 'DEPRECATED_API');
  }
}

/**
 * Исключение для неверного формата запроса
 */
export class BadRequestException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
  }
}

/**
 * Исключение для неверного типа контента
 */
export class UnsupportedMediaTypeException extends BusinessException {
  constructor(message: string = 'Неподдерживаемый тип медиа') {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'UNSUPPORTED_MEDIA_TYPE');
  }
}

/**
 * Исключение для слишком больших запросов
 */
export class PayloadTooLargeException extends BusinessException {
  constructor(message: string = 'Размер запроса слишком большой') {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE, 'PAYLOAD_TOO_LARGE');
  }
}

/**
 * Исключение для неверного токена
 */
export class InvalidTokenException extends BusinessException {
  constructor(message: string = 'Неверный токен') {
    super(message, HttpStatus.UNAUTHORIZED, 'INVALID_TOKEN');
  }
}

/**
 * Исключение для истекшего токена
 */
export class TokenExpiredException extends BusinessException {
  constructor(message: string = 'Токен истек') {
    super(message, HttpStatus.UNAUTHORIZED, 'TOKEN_EXPIRED');
  }
}

/**
 * Исключение для недостаточных прав
 */
export class InsufficientPermissionsException extends BusinessException {
  constructor(message: string = 'Недостаточно прав для выполнения операции') {
    super(message, HttpStatus.FORBIDDEN, 'INSUFFICIENT_PERMISSIONS');
  }
}

/**
 * Исключение для блокировки ресурса
 */
export class ResourceLockedException extends BusinessException {
  constructor(message: string = 'Ресурс заблокирован') {
    super(message, HttpStatus.LOCKED, 'RESOURCE_LOCKED');
  }
}

/**
 * Исключение для дублирования ресурса
 */
export class DuplicateResourceException extends BusinessException {
  constructor(resource: string, field: string, value: any) {
    const message = `${resource} с ${field} '${value}' уже существует`;
    super(message, HttpStatus.CONFLICT, 'DUPLICATE_RESOURCE');
  }
}

/**
 * Исключение для неверного состояния
 */
export class InvalidStateException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'INVALID_STATE', details);
  }
}
