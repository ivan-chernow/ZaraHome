/**
 * Утилиты для анализа производительности и размера bundle
 */

export interface BundleAnalysisResult {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  largestChunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  recommendations: string[];
}

/**
 * Анализирует размер bundle и дает рекомендации по оптимизации
 */
export const analyzeBundle = (): BundleAnalysisResult => {
  // В реальном приложении здесь был бы анализ реальных данных
  // Для демонстрации возвращаем примерные данные
  return {
    totalSize: 2.5 * 1024 * 1024, // 2.5MB
    jsSize: 1.8 * 1024 * 1024, // 1.8MB
    cssSize: 0.3 * 1024 * 1024, // 300KB
    imageSize: 0.4 * 1024 * 1024, // 400KB
    largestChunks: [
      { name: 'main.js', size: 800 * 1024, percentage: 32 },
      { name: 'vendor.js', size: 600 * 1024, percentage: 24 },
      { name: 'product-page.js', size: 400 * 1024, percentage: 16 },
      { name: 'cart-page.js', size: 300 * 1024, percentage: 12 },
      { name: 'profile-page.js', size: 200 * 1024, percentage: 8 },
    ],
    recommendations: [
      'Используйте dynamic imports для больших компонентов',
      'Оптимизируйте изображения с помощью next/image',
      'Рассмотрите возможность разделения vendor.js на более мелкие chunks',
      'Используйте tree shaking для удаления неиспользуемого кода',
      'Настройте gzip сжатие на сервере',
    ],
  };
};

/**
 * Форматирует размер в читаемый вид
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Проверяет, нужно ли оптимизировать bundle
 */
export const shouldOptimizeBundle = (totalSize: number): boolean => {
  const maxRecommendedSize = 2 * 1024 * 1024; // 2MB
  return totalSize > maxRecommendedSize;
};

/**
 * Генерирует отчет по производительности
 */
export const generatePerformanceReport = (): string => {
  const analysis = analyzeBundle();
  const needsOptimization = shouldOptimizeBundle(analysis.totalSize);

  let report = `# 📊 Bundle Analysis Report\n\n`;
  report += `**Общий размер:** ${formatSize(analysis.totalSize)}\n`;
  report += `**JavaScript:** ${formatSize(analysis.jsSize)}\n`;
  report += `**CSS:** ${formatSize(analysis.cssSize)}\n`;
  report += `**Изображения:** ${formatSize(analysis.imageSize)}\n\n`;

  report += `## 🎯 Самые большие chunks:\n`;
  analysis.largestChunks.forEach(chunk => {
    report += `- **${chunk.name}:** ${formatSize(chunk.size)} (${chunk.percentage}%)\n`;
  });

  if (needsOptimization) {
    report += `\n## ⚠️ Требуется оптимизация!\n`;
    report += `Размер bundle превышает рекомендуемый (2MB)\n\n`;
  }

  report += `## 💡 Рекомендации:\n`;
  analysis.recommendations.forEach((rec, index) => {
    report += `${index + 1}. ${rec}\n`;
  });

  return report;
};
