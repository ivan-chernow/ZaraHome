import { Controller, Post, Body } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';

@Controller('auth/reset-password')
export class ResetPasswordController {
	constructor(private readonly resetService: ResetPasswordService) { }

	@Post('request')
	async request(@Body('email') email: string) {
		await this.resetService.requestReset(email);
		return { success: true, message: 'Код отправлен на email' };
	}

	@Post('verify')
	async verify(@Body('email') email: string, @Body('token') token: string) {
		const verifiedToken = await this.resetService.verifyCode(email, token);
		return { success: true, token: verifiedToken };
	}

	@Post('set')
	async set(@Body('token') token: string, @Body('password') password: string) {
		await this.resetService.setNewPassword(token, password);
		return { success: true, message: 'Пароль успешно изменён' };
	}
}
