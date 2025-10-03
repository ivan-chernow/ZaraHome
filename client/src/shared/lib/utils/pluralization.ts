/**
 * Утилиты для склонения слов в русском языке
 */

/**
 * Склонение слова "товар" в зависимости от количества
 */
export const getItemsWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'товаров';
  }

  switch (lastDigit) {
    case 1:
      return 'товар';
    case 2:
    case 3:
    case 4:
      return 'товара';
    default:
      return 'товаров';
  }
};

/**
 * Универсальная функция для склонения русских слов
 * @param count - количество
 * @param forms - массив форм [1, 2-4, 5+] например: ['товар', 'товара', 'товаров']
 */
export const pluralize = (
  count: number,
  forms: [string, string, string]
): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  switch (lastDigit) {
    case 1:
      return forms[0];
    case 2:
    case 3:
    case 4:
      return forms[1];
    default:
      return forms[2];
  }
};
