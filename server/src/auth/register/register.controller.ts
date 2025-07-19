import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationService } from './register.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth/registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Post('initiate')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут
    async initiate(@Body('email') email: string) {
        await this.registrationService.initiateRegistration(email);
        return { success: true, message: `Код подтверждения отправлен на email ${email}` };
    }   

    @Post('verify-code')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут

    async verifyCode(@Body('email') email: string, @Body('code') code: string) {
        const sessionToken = await this.registrationService.verifyByCode(email, code);
        return { success: true, sessionToken, message: `Код подтверждения подтвержден, токен сессии ${sessionToken}` };
    }

    @Post('complete')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 300 } }) // 3 запроса в 5 минут
    async complete(
        @Body('sessionToken') sessionToken: string,
        @Body('password') password: string,
    ) {
        const user = await this.registrationService.completeRegistration(sessionToken, password);
        return { success: true, user, message: `Регистрация завершена, пользователь ${user.email} создан` };
    }
}
