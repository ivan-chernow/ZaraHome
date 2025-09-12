import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginService } from './login.service';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class LoginController {
  private readonly loginService: LoginService;
  private readonly responseService: ResponseService;

  constructor(loginService: LoginService, responseService: ResponseService) {
    this.loginService = loginService;
    this.responseService = responseService;
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const user = await this.loginService.validateUser(
      body.email,
      body.password
    );
    const result = await this.loginService.login(user, res);
    return res.json(
      this.responseService.success(result, 'Успешная авторизация')
    );
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() body: RefreshTokenDto,
    @Res() res: Response
  ) {
    const refreshToken = req.cookies?.refreshToken || body?.refreshToken;

    if (!refreshToken) {
      return res
        .status(400)
        .json(this.responseService.error('Refresh token is required'));
    }

    const result = await this.loginService.refreshTokens(refreshToken, res);
    return res.json(this.responseService.success(result, 'Токены обновлены'));
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user: { id: number } },
    @Res() res: Response
  ) {
    await this.loginService.logout(req.user.id, res);
    return res.json(this.responseService.success(undefined, 'Успешный выход'));
  }
}
