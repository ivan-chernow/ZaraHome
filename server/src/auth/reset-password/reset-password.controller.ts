import { Controller, Post, Body } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResponseService } from 'src/shared/services/response.service';
import { ResetRequestDto, ResetSetDto, ResetVerifyDto } from './dto/reset-password.dto';

@Controller('auth/reset-password')
export class ResetPasswordController {
	constructor(
		private readonly resetService: ResetPasswordService,
		private readonly responseService: ResponseService,
	) { }

	@Post('request')
	async request(@Body() dto: ResetRequestDto) {
		await this.resetService.requestReset(dto.email);
		return this.responseService.success(undefined, 'Код отправлен на email');
	}

	@Post('verify')
	async verify(@Body() dto: ResetVerifyDto) {
		const verifiedToken = await this.resetService.verifyCode(dto.email, dto.token);
		return this.responseService.success({ token: verifiedToken }, 'Код подтвержден');
	}

	@Post('set')
	async set(@Body() dto: ResetSetDto) {
		await this.resetService.setNewPassword(dto.token, dto.password);
		return this.responseService.success(undefined, 'Пароль успешно изменён');
	}
}
