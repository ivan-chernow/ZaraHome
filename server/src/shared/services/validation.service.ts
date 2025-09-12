import { Injectable, Logger } from '@nestjs/common';
import { SHARED_CONSTANTS } from '../shared.constants';
import {
  IValidationService,
  ValidationResult,
  BulkValidationResult,
} from '../shared.interfaces';

@Injectable()
export class ValidationService implements IValidationService {
  private readonly logger = new Logger(ValidationService.name);

  async validateEmail(email: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Проверяем длину
      if (email.length > SHARED_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH) {
        errors.push(
          `Email не может быть длиннее ${SHARED_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH} символов`
        );
      }

      // Проверяем формат через регулярное выражение
      if (!SHARED_CONSTANTS.REGEX.EMAIL.test(email)) {
        errors.push('Некорректный формат email');
      }

      // Проверяем наличие @ символа
      if (!email.includes('@')) {
        errors.push('Email должен содержать символ @');
      }

      // Проверяем домен
      const parts = email.split('@');
      if (parts.length !== 2 || !parts[1].includes('.')) {
        errors.push('Email должен содержать корректный домен');
      }

      // Предупреждения
      if (email.length > 100) {
        warnings.push(
          'Email довольно длинный, рассмотрите использование более короткого'
        );
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? email.toLowerCase().trim() : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating email: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации email'],
        warnings: [],
      };
    }
  }

  async validatePhone(phone: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Проверяем длину
      if (phone.length > SHARED_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH) {
        errors.push(
          `Номер телефона не может быть длиннее ${SHARED_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH} символов`
        );
      }

      // Проверяем минимальную длину
      if (phone.length < 7) {
        errors.push('Номер телефона слишком короткий');
      }

      // Проверяем формат через регулярное выражение
      if (!SHARED_CONSTANTS.REGEX.PHONE.test(phone)) {
        errors.push('Некорректный формат номера телефона');
      }

      // Проверяем наличие только цифр, пробелов, скобок и дефисов
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\d+$/.test(cleanPhone)) {
        errors.push(
          'Номер телефона должен содержать только цифры, пробелы, скобки и дефисы'
        );
      }

      // Предупреждения
      if (phone.length > 15) {
        warnings.push('Номер телефона довольно длинный');
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? this.normalizePhone(phone) : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating phone: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации номера телефона'],
        warnings: [],
      };
    }
  }

  async validatePassword(password: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Проверяем минимальную длину
      if (password.length < SHARED_CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH) {
        errors.push(
          `Пароль должен содержать не менее ${SHARED_CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH} символов`
        );
      }

      // Проверяем максимальную длину
      if (password.length > SHARED_CONSTANTS.SECURITY.PASSWORD_MAX_LENGTH) {
        errors.push(
          `Пароль не может быть длиннее ${SHARED_CONSTANTS.SECURITY.PASSWORD_MAX_LENGTH} символов`
        );
      }

      // Проверяем сложность пароля
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[@$!%*?&]/.test(password);

      if (!hasLowerCase) {
        errors.push('Пароль должен содержать строчные буквы');
      }

      if (!hasUpperCase) {
        errors.push('Пароль должен содержать заглавные буквы');
      }

      if (!hasNumbers) {
        errors.push('Пароль должен содержать цифры');
      }

      if (!hasSpecialChars) {
        errors.push('Пароль должен содержать специальные символы (@$!%*?&)');
      }

      // Предупреждения
      if (password.length < 12) {
        warnings.push(
          'Рекомендуется использовать пароль длиной не менее 12 символов'
        );
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? password : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating password: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации пароля'],
        warnings: [],
      };
    }
  }

  async validateString(
    value: string,
    maxLength?: number
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const maxLen = maxLength || SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH;

      // Проверяем максимальную длину
      if (value.length > maxLen) {
        errors.push(`Строка не может быть длиннее ${maxLen} символов`);
      }

      // Проверяем на пустую строку
      if (value.trim().length === 0) {
        warnings.push('Строка пустая');
      }

      // Предупреждения
      if (value.length > maxLen * 0.8) {
        warnings.push(
          `Строка близка к максимальной длине (${maxLen} символов)`
        );
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? value.trim() : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating string: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации строки'],
        warnings: [],
      };
    }
  }

  async validateArray(
    value: any[],
    maxLength?: number
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const maxLen = maxLength || SHARED_CONSTANTS.VALIDATION.MAX_ARRAY_LENGTH;

      // Проверяем максимальную длину
      if (value.length > maxLen) {
        errors.push(`Массив не может содержать более ${maxLen} элементов`);
      }

      // Проверяем на пустой массив
      if (value.length === 0) {
        warnings.push('Массив пустой');
      }

      // Предупреждения
      if (value.length > maxLen * 0.8) {
        warnings.push(
          `Массив близок к максимальной длине (${maxLen} элементов)`
        );
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? value : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating array: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации массива'],
        warnings: [],
      };
    }
  }

  async validateObject(
    value: any,
    maxKeys?: number
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      if (typeof value !== 'object' || value === null) {
        errors.push('Значение должно быть объектом');
        return {
          isValid: false,
          errors,
          warnings: [],
        };
      }

      const maxKeysCount =
        maxKeys || SHARED_CONSTANTS.VALIDATION.MAX_OBJECT_KEYS;

      // Проверяем максимальное количество ключей
      if (Object.keys(value).length > maxKeysCount) {
        errors.push(`Объект не может содержать более ${maxKeysCount} ключей`);
      }

      // Проверяем на пустой объект
      if (Object.keys(value).length === 0) {
        warnings.push('Объект пустой');
      }

      // Предупреждения
      if (Object.keys(value).length > maxKeysCount * 0.8) {
        warnings.push(
          `Объект близок к максимальному количеству ключей (${maxKeysCount})`
        );
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        normalizedValue: isValid ? value : undefined,
      };
    } catch (error) {
      this.logger.error(`Error validating object: ${error.message}`);
      return {
        isValid: false,
        errors: ['Ошибка валидации объекта'],
        warnings: [],
      };
    }
  }

  async bulkValidate(data: Record<string, any>): Promise<BulkValidationResult> {
    const results: Record<string, ValidationResult> = {};
    const errors: string[] = [];
    let total = 0;
    let valid = 0;
    let invalid = 0;

    try {
      for (const [key, value] of Object.entries(data)) {
        total++;
        let result: ValidationResult;

        if (typeof value === 'string') {
          if (key.toLowerCase().includes('email')) {
            result = await this.validateEmail(value);
          } else if (key.toLowerCase().includes('phone')) {
            result = await this.validatePhone(value);
          } else {
            result = await this.validateString(value);
          }
        } else if (Array.isArray(value)) {
          result = await this.validateArray(value);
        } else if (typeof value === 'object' && value !== null) {
          result = await this.validateObject(value);
        } else {
          result = {
            isValid: true,
            errors: [],
            warnings: [],
          };
        }

        results[key] = result;

        if (result.isValid) {
          valid++;
        } else {
          invalid++;
          errors.push(...result.errors.map(error => `${key}: ${error}`));
        }
      }

      return {
        results,
        summary: {
          total,
          valid,
          invalid,
          criticalErrors: 0,
          warnings: 0,
          suggestions: 0,
        },
        total,
        valid,
        invalid,
      };
    } catch (error) {
      this.logger.error(`Error in bulk validation: ${error.message}`);
      throw new Error('Ошибка массовой валидации');
    }
  }

  // Приватные методы
  private normalizePhone(phone: string): string {
    // Убираем все символы кроме цифр
    const digits = phone.replace(/\D/g, '');

    // Добавляем код страны если его нет
    if (digits.length === 10 && !phone.startsWith('+')) {
      return `+7${digits}`;
    }

    // Добавляем + если его нет и номер начинается с 7 или 8
    if (
      digits.length === 11 &&
      (digits.startsWith('7') || digits.startsWith('8'))
    ) {
      return `+7${digits.substring(1)}`;
    }

    return phone;
  }
}
