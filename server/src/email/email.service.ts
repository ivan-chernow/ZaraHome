import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { EMAIL_CONSTANTS } from './email.constants';

interface EmailTemplate {
  subject: string;
  templateName: string;
  requiredFields: string[];
}

interface EmailMetrics {
  sent: number;
  failed: number;
  totalAttempts: number;
}

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress: string;
  private readonly templateCache = new Map<string, hbs.TemplateDelegate>();
  private readonly metrics: EmailMetrics = {
    sent: 0,
    failed: 0,
    totalAttempts: 0
  };

  // Шаблоны email
  private readonly emailTemplates: Record<string, EmailTemplate> = {
    verification: {
      subject: 'Ваш код подтверждения ZaraHome',
      templateName: 'email-verification-code',
      requiredFields: ['code']
    },
    welcome: {
      subject: 'Добро пожаловать в ZaraHome',
      templateName: 'email-welcome-user',
      requiredFields: ['name']
    },
    resetPassword: {
      subject: 'Код для сброса пароля ZaraHome',
      templateName: 'email-reset-password',
      requiredFields: ['resetLink']
    }
  };

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.fromAddress = this.config.get<string>('MAIL_FROM') || 'onboarding@resend.dev';
      this.logger.log('EmailService initialized with API key: Present');
      this.preloadTemplates();
    } else {
      this.logger.warn('EmailService initialized without API key - email sending will be disabled');
    }
  }

  /**
   * Предварительная загрузка и кеширование шаблонов
   */
  private preloadTemplates(): void {
    try {
      const templatesDir = path.join(__dirname, 'templates');
      
      Object.values(this.emailTemplates).forEach(template => {
        const templatePath = path.join(templatesDir, `${template.templateName}.hbs`);
        
        if (fs.existsSync(templatePath)) {
          const templateSource = fs.readFileSync(templatePath, 'utf8');
          const compiledTemplate = hbs.compile(templateSource);
          this.templateCache.set(template.templateName, compiledTemplate);
          this.logger.log(`Template cached: ${template.templateName}`);
        } else {
          this.logger.error(`Template file not found: ${templatePath}`);
        }
      });
    } catch (error) {
      this.logger.error('Failed to preload templates:', error);
    }
  }

  /**
   * Валидация email адреса
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Валидация контекста шаблона
   */
  private validateTemplateContext(templateName: string, context: Record<string, any>): void {
    const template = this.emailTemplates[templateName];
    if (!template) {
      throw new BadRequestException(EMAIL_CONSTANTS.ERRORS.INVALID_TEMPLATE);
    }

    for (const field of template.requiredFields) {
      if (!context[field]) {
        throw new BadRequestException(EMAIL_CONSTANTS.ERRORS.MISSING_REQUIRED_FIELD(field));
      }
    }
  }

  /**
   * Отправка email с retry логикой
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
    retryAttempts: number = EMAIL_CONSTANTS.MAX_RETRY_ATTEMPTS
  ): Promise<void> {
    // Валидация входных данных
    if (!to || !this.validateEmail(to)) {
      throw new BadRequestException(EMAIL_CONSTANTS.ERRORS.INVALID_EMAIL);
    }

    if (!subject || subject.trim().length === 0) {
      throw new BadRequestException(EMAIL_CONSTANTS.ERRORS.INVALID_SUBJECT);
    }

    if (!this.resend) {
      this.logger.warn('Email service not configured - skipping email send');
      return;
    }

    this.metrics.totalAttempts++;

    // Проверяем rate limiting
    if (this.isRateLimited()) {
      throw new BadRequestException(EMAIL_CONSTANTS.ERRORS.RATE_LIMIT_EXCEEDED);
    }

    // Валидация контекста
    this.validateTemplateContext(templateName, context);

    // Получаем кешированный шаблон
    const template = this.templateCache.get(templateName);
    if (!template) {
      throw new InternalServerErrorException(EMAIL_CONSTANTS.ERRORS.TEMPLATE_NOT_FOUND);
    }

    // Добавляем общие поля в контекст
    const enrichedContext = {
      ...context,
      year: new Date().getFullYear(),
      currentDate: new Date().toLocaleDateString('ru-RU')
    };

    // Компилируем HTML
    const html = template(enrichedContext);

    // Отправляем email с retry логикой
    let lastError: Error;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        this.logger.log(`Attempting to send email to: ${to} (attempt ${attempt}/${retryAttempts})`);

        const result = await this.resend.emails.send({
          from: this.fromAddress,
          to: to,
          subject,
          html,
        });

        this.logger.log('Email sent successfully:', result);
        this.metrics.sent++;
        
        // Логируем успешную отправку
        this.logEmailSuccess(to, subject, templateName);
        return;

      } catch (error) {
        lastError = error;
        this.logger.error(`Failed to send email (attempt ${attempt}/${retryAttempts}):`, error);
        
        // Если это последняя попытка, не ждем
        if (attempt < retryAttempts) {
          const delay = EMAIL_CONSTANTS.RETRY_DELAY * attempt;
          this.logger.log(`Retrying in ${delay}ms...`);
          await this.delay(delay);
        }
      }
    }

    // Все попытки исчерпаны
    this.metrics.failed++;
    this.logEmailFailure(to, subject, templateName, lastError);
    throw new InternalServerErrorException(EMAIL_CONSTANTS.ERRORS.SEND_FAILED + lastError.message);
  }

  /**
   * Проверка rate limiting
   */
  private isRateLimited(): boolean {
    // Простая реализация rate limiting
    // В продакшене лучше использовать Redis или другой внешний сервис
    const now = Date.now();
    const windowMs = EMAIL_CONSTANTS.RATE_LIMIT_WINDOW;
    const maxEmails = EMAIL_CONSTANTS.RATE_LIMIT_MAX_EMAILS;
    
    // Здесь можно добавить более сложную логику rate limiting
    return false; // Пока отключено
  }

  /**
   * Задержка для retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Логирование успешной отправки
   */
  private logEmailSuccess(to: string, subject: string, templateName: string): void {
    this.logger.log(`✅ Email sent successfully to ${to} using template ${templateName}`);
  }

  /**
   * Логирование неудачной отправки
   */
  private logEmailFailure(to: string, subject: string, templateName: string, error: Error): void {
    this.logger.error(`❌ Failed to send email to ${to} using template ${templateName}: ${error.message}`);
  }

  /**
   * Отправка кода подтверждения
   */
  async sendVerificationCodeEmail(to: string, code: string): Promise<void> {
    await this.sendTemplateEmail(
      to,
      this.emailTemplates.verification.subject,
      'verification',
      { code }
    );
  }

  /**
   * Отправка приветственного письма
   */
  async sendWelcomeUser(to: string, name?: string): Promise<void> {
    await this.sendTemplateEmail(
      to,
      this.emailTemplates.welcome.subject,
      'welcome',
      { name: name || 'User' }
    );
  }

  /**
   * Отправка письма для сброса пароля
   */
  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    const fullResetLink = `http://localhost:3000/reset-password?token=${resetLink}`;
    
    await this.sendTemplateEmail(
      to,
      this.emailTemplates.resetPassword.subject,
      'resetPassword',
      { resetLink: fullResetLink }
    );
  }

  /**
   * Получение метрик отправки
   */
  getMetrics(): EmailMetrics {
    return { ...this.metrics };
  }

  /**
   * Сброс метрик
   */
  resetMetrics(): void {
    this.metrics.sent = 0;
    this.metrics.failed = 0;
    this.metrics.totalAttempts = 0;
  }

  /**
   * Проверка состояния сервиса
   */
  isHealthy(): boolean {
    return !!this.resend && this.templateCache.size > 0;
  }

  /**
   * Получение списка доступных шаблонов
   */
  getAvailableTemplates(): string[] {
    return Object.keys(this.emailTemplates);
  }
}
