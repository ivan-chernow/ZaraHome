import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Хуки для работы с уведомлениями
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface NotificationOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Хук для управления уведомлениями
 * @param options - опции для уведомлений
 * @returns объект с методами управления уведомлениями
 */
export const useNotifications = (options: NotificationOptions = {}) => {
  const {
    maxNotifications = 5,
    defaultDuration = 5000,
    position = 'top-right',
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Удаление уведомления
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Очищаем таймаут
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  // Создание уведомления
  const createNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: duration ?? defaultDuration,
      timestamp: Date.now(),
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      
      // Ограничиваем количество уведомлений
      if (newNotifications.length > maxNotifications) {
        return newNotifications.slice(0, maxNotifications);
      }
      
      return newNotifications;
    });

    // Автоматическое удаление уведомления
    if (notification.duration && notification.duration > 0) {
      const timeout = setTimeout(() => {
        removeNotification(id);
      }, notification.duration);

      timeoutsRef.current.set(id, timeout);
    }

    return id;
  }, [defaultDuration, maxNotifications, removeNotification]);

  // Очистка всех уведомлений
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    
    // Очищаем все таймауты
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  // Методы для создания уведомлений разных типов
  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    return createNotification('success', title, message, duration);
  }, [createNotification]);

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    return createNotification('error', title, message, duration);
  }, [createNotification]);

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    return createNotification('warning', title, message, duration);
  }, [createNotification]);

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    return createNotification('info', title, message, duration);
  }, [createNotification]);

  // Очистка таймаутов при размонтировании
  useEffect(() => {
    return () => {
      const timeouts = timeoutsRef.current;
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return {
    notifications,
    createNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    position,
  };
};

/**
 * Хук для работы с toast уведомлениями
 * @param options - опции для toast уведомлений
 * @returns объект с методами управления toast уведомлениями
 */
export const useToast = (options: NotificationOptions = {}) => {
  const notificationHook = useNotifications(options);

  const toast = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    return notificationHook.createNotification(type, title, message, duration);
  }, [notificationHook]);

  return {
    ...notificationHook,
    toast,
  };
};

/**
 * Хук для работы с системными уведомлениями
 * @param options - опции для системных уведомлений
 * @returns объект с методами управления системными уведомлениями
 */
export const useSystemNotifications = (options: NotificationOptions = {}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const notificationHook = useNotifications(options);

  // Запрос разрешения на уведомления
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  }, []);

  // Создание системного уведомления
  const createSystemNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    // Создаем уведомление в UI
    const id = notificationHook.createNotification(type, title, message, duration);

    // Создаем системное уведомление если разрешено
    if (permission === 'granted' && 'Notification' in window) {
      const systemNotification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: id,
      });

      // Автоматически закрываем системное уведомление
      if (duration && duration > 0) {
        setTimeout(() => {
          systemNotification.close();
        }, duration);
      }
    }

    return id;
  }, [notificationHook, permission]);

  return {
    ...notificationHook,
    permission,
    requestPermission,
    createSystemNotification,
  };
};
