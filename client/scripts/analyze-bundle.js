#!/usr/bin/env node

/**
 * Скрипт для анализа bundle и генерации отчета
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Запуск анализа bundle...\n');

try {
  // Сборка проекта с анализом
  console.log('📦 Сборка проекта...');
  execSync('npm run build:analyze', { stdio: 'inherit' });
  
  console.log('\n✅ Сборка завершена!');
  console.log('📊 Bundle Analyzer должен открыться в браузере автоматически');
  
  // Генерация текстового отчета
  console.log('\n📝 Генерация отчета...');
  
  const reportPath = path.join(__dirname, '../bundle-analysis-report.txt');
  const reportContent = `
# Bundle Analysis Report
Generated: ${new Date().toLocaleString()}

## Команды для анализа:
- npm run analyze - запуск Bundle Analyzer
- npm run build:analyze - сборка с анализом

## Файлы для анализа:
- .next/analyze/ - результаты анализа
- .next/static/chunks/ - JavaScript chunks
- .next/static/css/ - CSS файлы

## Рекомендации:
1. Проверьте размер vendor.js - должен быть < 500KB
2. Убедитесь, что используется tree shaking
3. Оптимизируйте изображения
4. Используйте dynamic imports для больших компонентов
5. Настройте gzip сжатие

## Следующие шаги:
1. Откройте Bundle Analyzer в браузере
2. Найдите самые большие файлы
3. Примените рекомендации по оптимизации
4. Повторите анализ для проверки улучшений
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log(`📄 Отчет сохранен: ${reportPath}`);
  
  console.log('\n🎉 Анализ завершен!');
  console.log('💡 Откройте Bundle Analyzer в браузере для детального анализа');
  
} catch (error) {
  console.error('❌ Ошибка при анализе:', error.message);
  process.exit(1);
}
