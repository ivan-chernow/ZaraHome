import { Injectable, Logger } from '@nestjs/common';
import { SHARED_CONSTANTS } from '../shared.constants';
import { IMonitoringService, MetricsData, HealthStatus, HealthCheck } from '../shared.interfaces';

@Injectable()
export class MonitoringService implements IMonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly metrics = new Map<string, any>();
  private readonly counters = new Map<string, number>();
  private readonly gauges = new Map<string, number>();
  private readonly histograms = new Map<string, number[]>();
  private readonly timings = new Map<string, number[]>();
  private readonly startTime = Date.now();

  async recordMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      this.metrics.set(key, {
        value,
        timestamp: Date.now(),
        tags: tags || {}
      });
      
      this.logger.debug(`Metric recorded: ${name} = ${value}`);
    } catch (error) {
      this.logger.error(`Error recording metric ${name}: ${error.message}`);
    }
  }

  async incrementCounter(name: string, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      const currentValue = this.counters.get(key) || 0;
      this.counters.set(key, currentValue + 1);
      
      this.logger.debug(`Counter incremented: ${name}`);
    } catch (error) {
      this.logger.error(`Error incrementing counter ${name}: ${error.message}`);
    }
  }

  async decrementCounter(name: string, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      const currentValue = this.counters.get(key) || 0;
      this.counters.set(key, Math.max(0, currentValue - 1));
      
      this.logger.debug(`Counter decremented: ${name}`);
    } catch (error) {
      this.logger.error(`Error decrementing counter ${name}: ${error.message}`);
    }
  }

  async setGauge(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      this.gauges.set(key, value);
      
      this.logger.debug(`Gauge set: ${name} = ${value}`);
    } catch (error) {
      this.logger.error(`Error setting gauge ${name}: ${error.message}`);
    }
  }

  async recordHistogram(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      const currentHistogram = this.histograms.get(key) || [];
      currentHistogram.push(value);
      
      // Ограничиваем размер гистограммы
      if (currentHistogram.length > 1000) {
        currentHistogram.splice(0, currentHistogram.length - 1000);
      }
      
      this.histograms.set(key, currentHistogram);
      
      this.logger.debug(`Histogram recorded: ${name} = ${value}`);
    } catch (error) {
      this.logger.error(`Error recording histogram ${name}: ${error.message}`);
    }
  }

  async recordTiming(name: string, duration: number, tags?: Record<string, string>): Promise<void> {
    try {
      const key = this.buildMetricKey(name, tags);
      const currentTimings = this.timings.get(key) || [];
      currentTimings.push(duration);
      
      // Ограничиваем размер массива таймингов
      if (currentTimings.length > 1000) {
        currentTimings.splice(0, currentTimings.length - 1000);
      }
      
      this.timings.set(key, currentTimings);
      
      this.logger.debug(`Timing recorded: ${name} = ${duration}ms`);
    } catch (error) {
      this.logger.error(`Error recording timing ${name}: ${error.message}`);
    }
  }

  async getMetrics(): Promise<MetricsData> {
    try {
      const timestamp = new Date();
      
      return {
        counters: Object.fromEntries(this.counters),
        gauges: Object.fromEntries(this.gauges),
        histograms: Object.fromEntries(this.histograms),
        timings: Object.fromEntries(this.timings)
      };
    } catch (error) {
      this.logger.error(`Error getting metrics: ${error.message}`);
      throw new Error('Ошибка получения метрик');
    }
  }

  async getHealthStatus(): Promise<HealthStatus> {
    try {
      const startTime = Date.now();
      const checks: HealthCheck[] = [];
      
      // Проверка памяти
      const memoryCheck = await this.checkMemory();
      checks.push(memoryCheck);
      
      // Проверка метрик
      const metricsCheck = await this.checkMetrics();
      checks.push(metricsCheck);
      
      // Проверка времени работы
      const uptimeCheck = await this.checkUptime();
      checks.push(uptimeCheck);
      
      const responseTime = Date.now() - startTime;
      
      // Определяем общий статус
      const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
      const hasDegraded = checks.some(check => check.status === 'unhealthy');
      
              let status: 'healthy' | 'unhealthy' = 'healthy';
        if (hasUnhealthy) {
          status = 'unhealthy';
        }
      
      return {
        status,
        checks,
        timestamp: new Date(),
        uptime: Date.now() - this.startTime
      };
    } catch (error) {
      this.logger.error(`Error getting health status: ${error.message}`);
      throw new Error('Ошибка получения статуса здоровья');
    }
  }

  // Приватные методы
  private buildMetricKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }
    
    const sortedTags = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    
    return `${name}:${sortedTags}`;
  }

  private async checkMemory(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const memUsage = process.memoryUsage();
      const heapUsed = memUsage.heapUsed;
      const heapTotal = memUsage.heapTotal;
      const memoryUsagePercent = (heapUsed / heapTotal) * 100;
      
      let status: 'healthy' | 'unhealthy' = 'healthy';
      let error: string | undefined;
      
      if (memoryUsagePercent > 80) {
        status = 'unhealthy';
        error = `Использование памяти высокое: ${memoryUsagePercent.toFixed(2)}%`;
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'memory',
        status,
        responseTime,
        error,
        details: {
          heapUsed: this.formatBytes(heapUsed),
          heapTotal: this.formatBytes(heapTotal),
          memoryUsagePercent: memoryUsagePercent.toFixed(2)
        }
      };
    } catch (error) {
      return {
        name: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: `Ошибка проверки памяти: ${error.message}`
      };
    }
  }

  private async checkMetrics(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const totalMetrics = this.metrics.size + this.counters.size + this.gauges.size + 
                          this.histograms.size + this.timings.size;
      
      let status: 'healthy' | 'unhealthy' = 'healthy';
      let error: string | undefined;
      
      if (totalMetrics > 10000) {
        status = 'unhealthy';
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'metrics',
        status,
        responseTime,
        error,
        details: {
          totalMetrics,
          metricsCount: this.metrics.size,
          countersCount: this.counters.size,
          gaugesCount: this.gauges.size,
          histogramsCount: this.histograms.size,
          timingsCount: this.timings.size
        }
      };
    } catch (error) {
      return {
        name: 'metrics',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: `Ошибка проверки метрик: ${error.message}`
      };
    }
  }

  private async checkUptime(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const uptime = Date.now() - this.startTime;
      const uptimeHours = uptime / (1000 * 60 * 60);
      
      let status: 'healthy' | 'unhealthy' = 'healthy';
      let error: string | undefined;
      
      if (uptimeHours > 168) { // 7 дней
        status = 'unhealthy';
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'uptime',
        status,
        responseTime,
        error,
        details: {
          uptimeMs: uptime,
          uptimeHours: uptimeHours.toFixed(2),
          startTime: new Date(this.startTime).toISOString()
        }
      };
    } catch (error) {
      return {
        name: 'uptime',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: `Ошибка проверки времени работы: ${error.message}`
      };
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Дополнительные методы для мониторинга
  async recordApiCall(endpoint: string, method: string, statusCode: number, duration: number): Promise<void> {
    await this.recordMetric('api.calls', 1, { endpoint, method, status: statusCode.toString() });
    await this.recordTiming('api.response_time', duration, { endpoint, method });
    
    if (statusCode >= 400) {
      await this.incrementCounter('api.errors', { endpoint, method, status: statusCode.toString() });
    }
  }

  async recordDatabaseQuery(query: string, duration: number, success: boolean): Promise<void> {
    await this.recordTiming('database.query_time', duration, { query: query.substring(0, 50) });
    await this.incrementCounter('database.queries', { success: success.toString() });
    
    if (!success) {
      await this.incrementCounter('database.errors', { query: query.substring(0, 50) });
    }
  }

  async recordCacheOperation(operation: string, key: string, hit: boolean, duration: number): Promise<void> {
    await this.recordTiming('cache.operation_time', duration, { operation, key: key.substring(0, 50) });
    await this.incrementCounter('cache.operations', { operation, hit: hit.toString() });
    
    if (hit) {
      await this.incrementCounter('cache.hits');
    } else {
      await this.incrementCounter('cache.misses');
    }
  }

  async getSystemStats(): Promise<Record<string, any>> {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        heapUsed: this.formatBytes(memUsage.heapUsed),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        external: this.formatBytes(memUsage.external),
        rss: this.formatBytes(memUsage.rss)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        version: process.version,
        platform: process.platform,
        arch: process.arch
      },
      metrics: {
        total: this.metrics.size + this.counters.size + this.gauges.size + this.histograms.size + this.timings.size
      }
    };
  }
}
