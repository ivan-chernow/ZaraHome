import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromAddress = this.config.get<string>('MAIL_FROM') || 'onboarding@resend.dev';
    this.logger.log('EmailService initialized with API key: ' + (apiKey ? 'Present' : 'Missing'));
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
        throw new InternalServerErrorException(`Template file not found at path: ${templatePath}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = hbs.compile(templateSource);
      const html = template(context);

      this.logger.log('Sending email via Resend...');
      const result = await this.resend.emails.send({
        from: this.fromAddress,
        to: to,
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
