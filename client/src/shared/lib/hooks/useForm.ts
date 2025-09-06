import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Хуки для работы с формами
 */

// interface FormField<T> {
//   value: T;
//   error?: string;
//   touched: boolean;
//   dirty: boolean;
// }

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface FormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Хук для работы с формами
 * @param options - опции формы
 * @returns объект с состоянием и методами формы
 */
export const useForm = <T extends Record<string, any>>(
  options: FormOptions<T>
) => {
  const {
    initialValues,
    validate,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [state, setState] = useState<FormState<T>>(() => ({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isValid: true,
    isSubmitting: false,
    isDirty: false,
  }));

  const validateTimeoutRef = useRef<NodeJS.Timeout>();

  // Валидация формы
  const validateForm = useCallback((values: T) => {
    if (!validate) return {};

    // Дебаунсинг валидации
    if (validateTimeoutRef.current) {
      clearTimeout(validateTimeoutRef.current);
    }

    return new Promise<Partial<Record<keyof T, string>>>((resolve) => {
      validateTimeoutRef.current = setTimeout(() => {
        const errors = validate(values);
        resolve(errors);
      }, 300);
    });
  }, [validate]);

  // Обновление поля
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setState(prevState => {
      const newValues = { ...prevState.values, [field]: value };
      const newDirty = { ...prevState.dirty, [field]: true };
      const isDirty = Object.values(newDirty).some(Boolean);

      return {
        ...prevState,
        values: newValues,
        dirty: newDirty,
        isDirty,
      };
    });

    // Валидация при изменении
    if (validateOnChange) {
      validateForm({ ...state.values, [field]: value }).then(errors => {
        setState(prevState => ({
          ...prevState,
          errors,
          isValid: Object.keys(errors).length === 0,
        }));
      });
    }
  }, [state.values, validateOnChange, validateForm]);

  // Установка ошибки поля
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState(prevState => ({
      ...prevState,
      errors: { ...prevState.errors, [field]: error },
      isValid: false,
    }));
  }, []);

  // Отметка поля как "тронутого"
  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setState(prevState => ({
      ...prevState,
      touched: { ...prevState.touched, [field]: touched },
    }));

    // Валидация при потере фокуса
    if (validateOnBlur && touched) {
      validateForm(state.values).then(errors => {
        setState(prevState => ({
          ...prevState,
          errors,
          isValid: Object.keys(errors).length === 0,
        }));
      });
    }
  }, [state.values, validateOnBlur, validateForm]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
    });
  }, [initialValues]);

  // Отправка формы
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setState(prevState => ({ ...prevState, isSubmitting: true }));

    try {
      // Валидация перед отправкой
      if (validate) {
        const errors = await validateForm(state.values);
        if (Object.keys(errors).length > 0) {
          setState(prevState => ({
            ...prevState,
            errors,
            isValid: false,
            isSubmitting: false,
          }));
          return;
        }
      }

      await onSubmit(state.values);
    } catch {
      // Error handling without console logging
    } finally {
      setState(prevState => ({ ...prevState, isSubmitting: false }));
    }
  }, [state.values, validate, validateForm, onSubmit]);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current);
      }
    };
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    handleSubmit,
  };
};

/**
 * Хук для работы с отдельным полем формы
 * @param form - объект формы
 * @param field - имя поля
 * @returns объект с состоянием и методами поля
 */
export const useFormField = <T extends Record<string, any>, K extends keyof T>(
  form: ReturnType<typeof useForm<T>>,
  field: K
) => {
  const value = form.values[field];
  const error = form.errors[field];
  const touched = form.touched[field] || false;
  const dirty = form.dirty[field] || false;

  const setValue = useCallback((newValue: T[K]) => {
    form.setFieldValue(field, newValue);
  }, [form, field]);

  const setError = useCallback((newError: string) => {
    form.setFieldError(field, newError);
  }, [form, field]);

  const setTouched = useCallback((newTouched: boolean = true) => {
    form.setFieldTouched(field, newTouched);
  }, [form, field]);

  return {
    value,
    error,
    touched,
    dirty,
    setValue,
    setError,
    setTouched,
  };
};

/**
 * Хук для дебаунсинга ввода в поля формы
 * @param value - значение поля
 * @param delay - задержка в миллисекундах
 * @returns дебаунсированное значение
 */
export const useFormFieldDebounce = <T>(
  value: T,
  delay: number = 300
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};
