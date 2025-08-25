export interface IValidationRule {
  field: string;
  rule: string;
  message: string;
  value?: any;
}

export interface IValidationResult {
  isValid: boolean;
  errors: IValidationRule[];
}

export interface IValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
    message?: string;
  };
}

export interface IProductValidationSchema extends IValidationSchema {
  name_eng: {
    required: true;
    minLength: 2;
    maxLength: 100;
    message: 'Название на английском должно быть от 2 до 100 символов';
  };
  name_ru: {
    required: true;
    minLength: 2;
    maxLength: 100;
    message: 'Название на русском должно быть от 2 до 100 символов';
  };
  description: {
    required: true;
    minLength: 10;
    maxLength: 1000;
    message: 'Описание должно быть от 10 до 1000 символов';
  };
  price: {
    required: true;
    type: 'number';
    min: 0;
    message: 'Цена должна быть положительным числом';
  };
}

export interface IUserValidationSchema extends IValidationSchema {
  email: {
    required: true;
    type: 'email';
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    message: 'Введите корректный email адрес';
  };
  password: {
    required: true;
    minLength: 6;
    maxLength: 50;
    message: 'Пароль должен быть от 6 до 50 символов';
  };
}
