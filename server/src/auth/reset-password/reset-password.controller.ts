import { Controller, Post, Body } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResponseService } from 'src/shared/services/response.service';

@Controller('auth/reset-password')
export class ResetPasswordController {
	constructor(
		private readonly resetService: ResetPasswordService,
		private readonly responseService: ResponseService,
	) { }

	@Post('request')
	async request(@Body('email') email: string) {
		try {
			await this.resetService.requestReset(email);
			return this.responseService.success(undefined, 'Код отправлен на email');
		} catch (error) {
			return this.responseService.error('Ошибка при запросе сброса пароля', error.message);
		}
	}

	@Post('verify')
	async verify(@Body('email') email: string, @Body('token') token: string) {
		try {
			const verifiedToken = await this.resetService.verifyCode(email, token);
			return this.responseService.success({ token: verifiedToken }, 'Код подтвержден');
		} catch (error) {
			return this.responseService.error('Ошибка при проверке кода', error.message);
		}
	}

	@Post('set')
	async set(@Body('token') token: string, @Body('password') password: string) {
		try {
			await this.resetService.setNewPassword(token, password);
			return this.responseService.success(undefined, 'Пароль успешно изменён');
		} catch (error) {
			return this.responseService.error('Ошибка при изменении пароля', error.message);
		}
	}
}
