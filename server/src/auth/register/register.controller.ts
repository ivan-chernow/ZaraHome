import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationService } from './register.service';
import { ResponseService } from 'src/shared/services/response.service';
import { Throttle } from '@nestjs/throttler';
import { RegistrationInitiateDto, RegistrationVerifyDto, RegistrationCompleteDto } from './dto/registration.dto';

@Controller('auth/registration')
export class RegistrationController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly responseService: ResponseService,
    ) { }

    @Post('initiate')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут
    async initiate(@Body() dto: RegistrationInitiateDto) {
        try {
            await this.registrationService.initiateRegistration(dto.email);
            return this.responseService.success(undefined, `Код подтверждения отправлен на email ${dto.email}`);
        } catch (error) {
            return this.responseService.error('Ошибка при инициации регистрации', error.message);
        }
    }   

    @Post('verify-code')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут
    async verifyCode(@Body() dto: RegistrationVerifyDto) {
        try {
            const sessionToken = await this.registrationService.verifyByCode(dto.email, dto.code);
            return this.responseService.success({ sessionToken }, `Код подтверждения подтвержден, токен сессии ${sessionToken}`);
        } catch (error) {
            return this.responseService.error('Ошибка при проверке кода', error.message);
        }
    }

    @Post('complete')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут
    async complete(@Body() dto: RegistrationCompleteDto) {
        try {
            const user = await this.registrationService.completeRegistration(dto.sessionToken, dto.password);
            return this.responseService.success({ user }, `Регистрация завершена, пользователь ${user.email} создан`);
        } catch (error) {
            return this.responseService.error('Ошибка при завершении регистрации', error.message);
        }
    }
}
