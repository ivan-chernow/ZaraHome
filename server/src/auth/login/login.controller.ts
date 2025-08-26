import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ResponseService } from 'src/shared/services/response.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        private readonly responseService: ResponseService,
    ) { }

    @Post('login')
    async login(@Body() body: LoginDto, @Res() res: Response) {
        try {
            const user = await this.loginService.validateUser(body.email, body.password);
            const result = await this.loginService.login(user, res);
            return res.json(this.responseService.success(result, 'Успешная авторизация'));
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                return res.status(401).json(this.responseService.error('Неверный email или пароль'));
            }
            return res.status(500).json(this.responseService.error('Ошибка авторизации', error.message));
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            // Безопасно получаем refreshToken из cookies или body
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

            // Проверяем наличие токена
            if (!refreshToken) {
                return res.status(400).json(this.responseService.error('Refresh token is required'));
            }

            const result = await this.loginService.refreshTokens(refreshToken, res);
            return res.json(this.responseService.success(result, 'Токены обновлены'));
        } catch (error) {
            return res.status(500).json(this.responseService.error('Ошибка обновления токенов', error.message));
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req: any, @Res() res: Response) {
        try {
            await this.loginService.logout(req.user.id, res);
            return res.json(this.responseService.success(undefined, 'Успешный выход'));
        } catch (error) {
            return res.status(500).json(this.responseService.error('Ошибка при выходе', error.message));
        }
    }
}
