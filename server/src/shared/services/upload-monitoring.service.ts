import { Injectable, Logger } from '@nestjs/common';
import { UploadResult } from './file-upload-error-handler.service';

export interface UploadMetrics {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  successRate: number;
  averageFileSize: number;
  totalFileSize: number;
  commonErrors: Map<string, number>;
  uploadTimes: number[];
  lastUploadTime: Date;
}

export interface ErrorAnalysis {
  mostCommonError: string;
  errorFrequency: number;
  errorTrend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
}

@Injectable()
export class UploadMonitoringService {
  private readonly logger = new Logger(UploadMonitoringService.name);
  private uploadHistory: UploadResult[] = [];
  private uploadTimes: number[] = [];
  private readonly maxHistorySize = 1000; // Храним последние 1000 загрузок

  /**
   * Записываем результаты загрузки для анализа
   */
  recordUploadResults(results: UploadResult[], uploadTimeMs: number): void {
    this.uploadHistory.push(...results);
    this.uploadTimes.push(uploadTimeMs);

    // Ограничиваем размер истории
    if (this.uploadHistory.length > this.maxHistorySize) {
      const excess = this.uploadHistory.length - this.maxHistorySize;
      this.uploadHistory.splice(0, excess);
      this.uploadTimes.splice(0, excess);
    }

    this.logger.log(
      `Записаны результаты загрузки: ${results.length} файлов за ${uploadTimeMs}ms`
    );
  }

  /**
   * Получаем текущую статистику загрузок
   */
  getCurrentMetrics(): UploadMetrics {
    const totalUploads = this.uploadHistory.length;
    const successfulUploads = this.uploadHistory.filter(r => r.success).length;
    const failedUploads = totalUploads - successfulUploads;
    const successRate = totalUploads > 0 ? successfulUploads / totalUploads : 0;

    // Анализируем ошибки
    const commonErrors = new Map<string, number>();
    this.uploadHistory
      .filter(r => !r.success && r.error)
      .forEach(result => {
        const error = result.error!;
        commonErrors.set(error, (commonErrors.get(error) || 0) + 1);
      });

    // Вычисляем средний размер файла (если доступно)
    const fileSizes = this.uploadHistory
      .filter(r => r.success)
      .map(r => r.filePath)
      .filter(Boolean)
      .map(path => this.estimateFileSize(path!));

    const totalFileSize = fileSizes.reduce((sum, size) => sum + size, 0);
    const averageFileSize =
      fileSizes.length > 0 ? totalFileSize / fileSizes.length : 0;

    const lastUploadTime =
      this.uploadTimes.length > 0
        ? new Date(Date.now() - this.uploadTimes[this.uploadTimes.length - 1])
        : new Date();

    return {
      totalUploads,
      successfulUploads,
      failedUploads,
      successRate,
      averageFileSize,
      totalFileSize,
      commonErrors,
      uploadTimes: [...this.uploadTimes],
      lastUploadTime,
    };
  }

  /**
   * Анализируем ошибки и даем рекомендации
   */
  analyzeErrors(): ErrorAnalysis {
    const metrics = this.getCurrentMetrics();
    const commonErrors = Array.from(metrics.commonErrors.entries());

    if (commonErrors.length === 0) {
      return {
        mostCommonError: 'Нет ошибок',
        errorFrequency: 0,
        errorTrend: 'stable',
        recommendations: ['Система работает стабильно'],
      };
    }

    // Сортируем ошибки по частоте
    commonErrors.sort((a, b) => b[1] - a[1]);
    const [mostCommonError, errorFrequency] = commonErrors[0];

    // Анализируем тренд ошибок (последние 100 загрузок vs предыдущие 100)
    const recentUploads = this.uploadHistory.slice(-100);
    const previousUploads = this.uploadHistory.slice(-200, -100);

    const recentErrorRate =
      recentUploads.length > 0
        ? recentUploads.filter(r => !r.success).length / recentUploads.length
        : 0;

    const previousErrorRate =
      previousUploads.length > 0
        ? previousUploads.filter(r => !r.success).length /
          previousUploads.length
        : 0;

    let errorTrend: 'increasing' | 'decreasing' | 'stable';
    if (recentErrorRate > previousErrorRate + 0.1) {
      errorTrend = 'increasing';
    } else if (recentErrorRate < previousErrorRate - 0.1) {
      errorTrend = 'decreasing';
    } else {
      errorTrend = 'stable';
    }

    // Генерируем рекомендации на основе анализа
    const recommendations = this.generateRecommendations(
      commonErrors,
      errorTrend,
      metrics
    );

    return {
      mostCommonError,
      errorFrequency,
      errorTrend,
      recommendations,
    };
  }

  /**
   * Генерируем рекомендации на основе анализа ошибок
   */
  private generateRecommendations(
    commonErrors: [string, number][],
    errorTrend: 'increasing' | 'decreasing' | 'stable',
    metrics: UploadMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Анализируем конкретные ошибки
    commonErrors.forEach(([error, _count]) => {
      if (error.includes('слишком большой')) {
        recommendations.push(
          'Рассмотрите возможность увеличения лимита размера файлов'
        );
      }
      if (error.includes('неподдерживаемый тип')) {
        recommendations.push('Проверьте список поддерживаемых форматов файлов');
      }
      if (error.includes('пустой')) {
        recommendations.push('Проверьте целостность загружаемых файлов');
      }
    });

    // Анализируем тренды
    if (errorTrend === 'increasing') {
      recommendations.push(
        '⚠️ Увеличивается количество ошибок. Проверьте системные ресурсы'
      );
    } else if (errorTrend === 'decreasing') {
      recommendations.push(
        '✅ Количество ошибок уменьшается. Система стабилизируется'
      );
    }

    // Анализируем общую статистику
    if (metrics.successRate < 0.8) {
      recommendations.push(
        '🔴 Низкий процент успешных загрузок. Требуется диагностика'
      );
    } else if (metrics.successRate > 0.95) {
      recommendations.push('🟢 Отличная стабильность загрузок');
    }

    // Анализируем размеры файлов
    if (metrics.averageFileSize > 5 * 1024 * 1024) {
      // > 5MB
      recommendations.push(
        '📁 Большие файлы могут замедлять загрузку. Рассмотрите сжатие'
      );
    }

    return recommendations;
  }

  /**
   * Очищаем историю загрузок
   */
  clearHistory(): void {
    this.uploadHistory = [];
    this.uploadTimes = [];
    this.logger.log('История загрузок очищена');
  }

  /**
   * Экспортируем статистику для внешних систем
   */
  exportMetrics(): Record<string, unknown> {
    const metrics = this.getCurrentMetrics();
    const errorAnalysis = this.analyzeErrors();

    return {
      timestamp: new Date().toISOString(),
      metrics: {
        ...metrics,
        commonErrors: Object.fromEntries(metrics.commonErrors),
      },
      errorAnalysis,
      systemHealth: this.calculateSystemHealth(metrics),
    };
  }

  /**
   * Вычисляем общее состояние системы
   */
  private calculateSystemHealth(
    metrics: UploadMetrics
  ): 'excellent' | 'good' | 'warning' | 'critical' {
    if (metrics.successRate >= 0.95) return 'excellent';
    if (metrics.successRate >= 0.85) return 'good';
    if (metrics.successRate >= 0.7) return 'warning';
    return 'critical';
  }

  /**
   * Оцениваем размер файла по пути (примерная оценка)
   */
  private estimateFileSize(filePath: string): number {
    // Простая эвристика для оценки размера
    // В реальной системе здесь можно использовать fs.stat
    if (filePath.includes('thumb-')) {
      return 50 * 1024; // ~50KB для миниатюр
    }
    return 500 * 1024; // ~500KB для основных изображений
  }

  /**
   * Получаем предупреждения о потенциальных проблемах
   */
  getWarnings(): string[] {
    const warnings: string[] = [];
    const metrics = this.getCurrentMetrics();
    const errorAnalysis = this.analyzeErrors();

    if (metrics.successRate < 0.8) {
      warnings.push(
        `Низкий процент успешных загрузок: ${Math.round(metrics.successRate * 100)}%`
      );
    }

    if (errorAnalysis.errorTrend === 'increasing') {
      warnings.push('Увеличивается количество ошибок загрузки');
    }

    if (metrics.failedUploads > 50) {
      warnings.push(
        `Большое количество неудачных загрузок: ${metrics.failedUploads}`
      );
    }

    return warnings;
  }
}
