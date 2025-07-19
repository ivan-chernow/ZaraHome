import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly USER_EMAIL = 'sutrame735@gmail.com'; // Замените на ваш email

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_2Mw7eJqZ_PZCLX8nPYtcKKj4uuv9oYEKK');
    this.logger.log('EmailService initialized with API key: ' + (process.env.RESEND_API_KEY ? 'Present' : 'Missing'));
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      this.logger.log(`Attempting to send email to: ${to}`);
      this.logger.log(`Using template: ${templateName}`);

      const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      this.logger.log(`Template path: ${templatePath}`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at path: ${templatePath}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = hbs.compile(templateSource);
      const html = template(context);

      this.logger.log('Sending email via Resend...');
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // Используем тестовый домен Resend
        to: this.USER_EMAIL, // Все письма будут приходить на ваш email
        subject,
        html,
      });

      this.logger.log('Email sent successfully:', result);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw new InternalServerErrorException('Ошибка при отправке письма: ' + error.message);
    }
  }

  async sendVerificationCodeEmail(to: string, code: string) {
    await this.sendTemplateEmail(
      to,
      'Ваш код подтверждения ZaraHome',
      'email-verification-code',
      { code, year: new Date().getFullYear() },
    );
  }

  async sendWelcomeUser(to: string) {
    await this.sendTemplateEmail(
      to,
      'Добро пожаловать в ZaraHome',
      'email-welcome-user',
      { name: 'User', year: new Date().getFullYear() },
    );
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    await this.sendTemplateEmail(
      to,
      'Код для сброса пароля ZaraHome',
      'email-reset-password',
      { resetLink: `http://localhost:3000/reset-password?token=${resetLink}`, year: new Date().getFullYear() },
    );
  }
}
