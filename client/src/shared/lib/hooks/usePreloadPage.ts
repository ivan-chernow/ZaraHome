import { useCallback } from 'react';

/**
 * Хук для предзагрузки страниц при наведении на ссылки
 */
export const usePreloadPage = () => {
  const preloadPage = useCallback((pagePath: string) => {
    // Предзагружаем страницу при наведении на ссылку
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = pagePath;
    link.as = 'document';
    
    // Добавляем в head только если еще не добавлен
    if (!document.querySelector(`link[href="${pagePath}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  const preloadComponent = useCallback((importFn: () => Promise<any>) => {
    // Предзагружаем компонент
    importFn().catch(() => {
      // Игнорируем ошибки предзагрузки
    });
  }, []);

  return {
    preloadPage,
    preloadComponent,
  };
};

/**
 * Хук для предзагрузки страниц при hover на навигационных элементах
 */
export const useNavigationPreload = () => {
  const { preloadPage, preloadComponent } = usePreloadPage();

  const preloadProductPage = useCallback((productId: string) => {
    preloadPage(`/products/${productId}`);
    // Предзагружаем компонент страницы товара
    preloadComponent(() => import('@/shared/ui/lazy/ProductPageLazy'));
  }, [preloadPage, preloadComponent]);

  const preloadCartPage = useCallback(() => {
    preloadPage('/cart');
    preloadComponent(() => import('@/shared/ui/lazy/CartPageLazy'));
  }, [preloadPage, preloadComponent]);

  const preloadProfilePage = useCallback(() => {
    preloadPage('/profile');
    preloadComponent(() => import('@/shared/ui/lazy/ProfilePageLazy'));
  }, [preloadPage, preloadComponent]);

  const preloadOrderPage = useCallback(() => {
    preloadPage('/order');
    preloadComponent(() => import('@/shared/ui/lazy/OrderPageLazy'));
  }, [preloadPage, preloadComponent]);

  return {
    preloadProductPage,
    preloadCartPage,
    preloadProfilePage,
    preloadOrderPage,
  };
};
