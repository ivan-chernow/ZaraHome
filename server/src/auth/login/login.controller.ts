import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post('login')
    async login(@Body() body: { email: string, password: string }, @Res() res: Response) {
        try {
            const user = await this.loginService.validateUser(body.email, body.password);
            const result = await this.loginService.login(user, res);
            return res.json(result);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Неверный email или пароль');
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies['refreshToken'] || req.body.refreshToken;
        const result = await this.loginService.refreshTokens(refreshToken, res);
        return res.json(result);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req: any, @Res() res: Response) {
        await this.loginService.logout(req.user.userId, res);
        return res.json({ success: true });
    }
}
