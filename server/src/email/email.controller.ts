import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { EmailService, EmailMetrics } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ResponseService } from '../shared/services/response.service';
import { ApiDefaultErrors } from '../common/swagger/swagger.decorators';
import { EMAIL_CONSTANTS } from './email.constants';

@ApiTags('email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiDefaultErrors()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить email с использованием шаблона' })
  @ApiOkResponse({ description: 'Email отправлен успешно' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendTemplateEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.templateType,
      sendEmailDto.context,
      sendEmailDto.retryAttempts
    );

    return this.responseService.success(
      undefined, 
      EMAIL_CONSTANTS.SUCCESS.EMAIL_SENT
    );
  }

  @Post('verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить код подтверждения' })
  @ApiOkResponse({ description: 'Код подтверждения отправлен' })
  async sendVerificationCode(@Body() body: { to: string; code: string }) {
    await this.emailService.sendVerificationCodeEmail(body.to, body.code);
    
    return this.responseService.success(
      undefined, 
      'Код подтверждения отправлен'
    );
  }

  @Post('welcome')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить приветственное письмо' })
  @ApiOkResponse({ description: 'Приветственное письмо отправлено' })
  async sendWelcomeEmail(@Body() body: { to: string; name?: string }) {
    await this.emailService.sendWelcomeUser(body.to, body.name);
    
    return this.responseService.success(
      undefined, 
      'Приветственное письмо отправлено'
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить письмо для сброса пароля' })
  @ApiOkResponse({ description: 'Письмо для сброса пароля отправлено' })
  async sendResetPasswordEmail(@Body() body: { to: string; resetLink: string }) {
    await this.emailService.sendResetPasswordEmail(body.to, body.resetLink);
    
    return this.responseService.success(
      undefined, 
      'Письмо для сброса пароля отправлено'
    );
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Получить метрики отправки email' })
  @ApiOkResponse({ description: 'Метрики получены' })
  async getMetrics() {
    const metrics = this.emailService.getMetrics();
    
    return this.responseService.success(
      metrics, 
      'Метрики получены'
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Проверить состояние email сервиса' })
  @ApiOkResponse({ description: 'Состояние сервиса получено' })
  async getHealth() {
    const isHealthy = this.emailService.isHealthy();
    
    return this.responseService.success(
      { 
        healthy: isHealthy,
        message: isHealthy ? 'Email сервис работает' : 'Email сервис не настроен'
      }, 
      'Состояние сервиса получено'
    );
  }

  @Get('templates')
  @ApiOperation({ summary: 'Получить список доступных шаблонов' })
  @ApiOkResponse({ description: 'Список шаблонов получен' })
  async getTemplates() {
    const templates = this.emailService.getAvailableTemplates();
    
    return this.responseService.success(
      templates, 
      'Список шаблонов получен'
    );
  }

  @Post('metrics/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Сбросить метрики email' })
  @ApiOkResponse({ description: 'Метрики сброшены' })
  async resetMetrics() {
    this.emailService.resetMetrics();
    
    return this.responseService.success(
      undefined, 
      EMAIL_CONSTANTS.SUCCESS.METRICS_RESET
    );
  }
}
