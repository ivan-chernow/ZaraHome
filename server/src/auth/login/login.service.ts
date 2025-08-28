import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '../../users/user/entity/user.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../auth.repository';
import { IAuthService } from 'src/common/interfaces/service.interface';

@Injectable()
export class LoginService implements IAuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

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

    async login(user: User, res?: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.authRepository.deleteRefreshTokenByUser(user.id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.authRepository.saveRefreshToken(refreshToken, user, expiresAt);

        // HttpOnly cookie
        if (res) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                expires: expiresAt,
                path: '/',
                secure: false, // В DEV! Только в проде true
            });
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

    async refreshTokens(refreshToken: string, res?: any) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.authRepository.findUserById(payload.sub);
            if (!user) throw new UnauthorizedException('Пользователь не найден');

            // Проверяем, что refreshToken есть в базе
            const tokenInDb = await this.authRepository.findRefreshTokenByToken(refreshToken, user.id);
            if (!tokenInDb) throw new UnauthorizedException('Невалидный refresh token');

            // Ротация: удаляем старый, создаём новый
            await this.authRepository.deleteRefreshTokenByToken(refreshToken);
            const newRefreshToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: '7d' });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await this.authRepository.saveRefreshToken(newRefreshToken, user, expiresAt);

            // HttpOnly cookie
            if (res) {
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    expires: expiresAt,
                    path: '/',
                });
            }

            return {
                accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: '15m' }),
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (e) {
            throw new UnauthorizedException('Невалидный refresh token');
        }
    }

    async logout(userId: number, res?: any) {
        await this.authRepository.deleteRefreshTokenByUser(userId);
        if (res) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // В DEV! Только в проде true
            });
        }
        return { success: true, message: 'Вы успешно вышли из системы' };
    }
}