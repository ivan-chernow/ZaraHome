import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ResponseService } from '../shared/services/response.service';
import { ApiDefaultErrors } from '../shared/shared.interfaces';
import { EMAIL_CONSTANTS } from './email.constants';

@ApiTags('email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiDefaultErrors()
export class EmailController {
  private readonly emailService: EmailService;
  private readonly responseService: ResponseService;

  constructor(emailService: EmailService, responseService: ResponseService) {
    this.emailService = emailService;
    this.responseService = responseService;
  }

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
  async sendResetPasswordEmail(
    @Body() body: { to: string; resetLink: string }
  ) {
    await this.emailService.sendResetPasswordEmail(body.to, body.resetLink);

    return this.responseService.success(
      undefined,
      'Письмо для сброса пароля отправлено'
    );
  }
}
