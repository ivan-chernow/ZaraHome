import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResponseService } from 'src/shared/services/response.service';
import { Throttle } from '@nestjs/throttler';
import {
  ResetRequestDto,
  ResetSetDto,
  ResetVerifyDto,
} from './dto/reset-password.dto';

@Controller('auth/reset-password')
export class ResetPasswordController {
  private readonly resetService: ResetPasswordService;
  private readonly responseService: ResponseService;

  constructor(
    resetService: ResetPasswordService,
    responseService: ResponseService
  ) {
    this.resetService = resetService;
    this.responseService = responseService;
  }

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900 } })
  async request(@Body() dto: ResetRequestDto) {
    await this.resetService.requestReset(dto.email);
    return this.responseService.success(
      undefined,
      `Код для сброса пароля отправлен на email ${dto.email}`
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300 } })
  async verify(@Body() dto: ResetVerifyDto) {
    const verifiedToken = await this.resetService.verifyCode(dto.token);
    return this.responseService.success(
      { token: verifiedToken },
      'Код подтверждения подтвержден'
    );
  }

  // Дополнительный обработчик GET для избежания 404 от случайных переходов по этому пути
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyInfo(@Query('token') token?: string) {
    // Этот эндпоинт предназначен только для информации, реальная проверка выполняется POST-запросом
    return this.responseService.success(
      {
        info: 'Use POST /auth/reset-password/verify with { email, token }',
        token: token || null,
      },
      'Endpoint is alive'
    );
  }

  @Post('set')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 300 } })
  async set(@Body() dto: ResetSetDto) {
    await this.resetService.setNewPassword(dto.token, dto.password);
    return this.responseService.success(undefined, 'Пароль успешно изменен');
  }
}
