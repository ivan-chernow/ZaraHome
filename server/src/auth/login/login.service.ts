import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/user/entity/user.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { AuthRepository } from '../auth.repository';
import { IAuthService } from 'src/shared/shared.interfaces';

@Injectable()
export class LoginService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new UnauthorizedException('Email и пароль обязательны');
    }

    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email не подтвержден');
    }

    if (!user.password) {
      throw new UnauthorizedException('Пароль не установлен');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async login(user: User, res?: Response) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.authRepository.deleteRefreshTokenByUser(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.authRepository.saveRefreshToken(refreshToken, user, expiresAt);

    if (res) {
      this.setRefreshTokenCookie(res, refreshToken, expiresAt);
    }

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string, res?: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.authRepository.findUserById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      const tokenInDb = await this.authRepository.findRefreshTokenByToken(refreshToken, user.id);
      if (!tokenInDb) {
        throw new UnauthorizedException('Невалидный refresh token');
      }

      await this.authRepository.deleteRefreshTokenByToken(refreshToken);
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role }, 
        { expiresIn: '30d' }
      );
      
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await this.authRepository.saveRefreshToken(newRefreshToken, user, expiresAt);

      if (res) {
        this.setRefreshTokenCookie(res, newRefreshToken, expiresAt);
      }

      return {
        accessToken: this.jwtService.sign(
          { sub: user.id, email: user.email, role: user.role }, 
          { expiresIn: '24h' }
        ),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Невалидный refresh token');
    }
  }

  async logout(userId: number, res?: Response) {
    await this.authRepository.deleteRefreshTokenByUser(userId);
    
    if (res) {
      this.clearRefreshTokenCookie(res);
    }
    
    return { 
      success: true, 
      message: 'Вы успешно вышли из системы' 
    };
  }

  private setRefreshTokenCookie(res: Response, token: string, expiresAt: Date): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}