import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user/entity/user.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService,
    ) { }


     async validateUser(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new UnauthorizedException('Email и пароль обязательны');
        }

        const user = await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
            select: ['id', 'email', 'password', 'isEmailVerified', 'role']
        });

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

        await this.refreshTokenRepository.delete({ user: { id: user.id } });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.save({ token: refreshToken, user, expiresAt });

        // HttpOnly cookie
        if (res) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                expires: expiresAt,
                path: '/',
                secure: false, // В DEV! Только в проде true
            });
            res.json({
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            });
            return;
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
            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user) throw new UnauthorizedException('Пользователь не найден');

            // Проверяем, что refreshToken есть в базе
            const tokenInDb = await this.refreshTokenRepository.findOne({ where: { token: refreshToken, user: { id: user.id } } });
            if (!tokenInDb) throw new UnauthorizedException('Невалидный refresh token');

            // Ротация: удаляем старый, создаём новый
            await this.refreshTokenRepository.delete({ token: refreshToken });
            const newRefreshToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: '7d' });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await this.refreshTokenRepository.save({ token: newRefreshToken, user, expiresAt });

            // HttpOnly cookie
            if (res) {
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    expires: expiresAt,
                    path: '/',
                });
                res.json({
                    accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: '15m' }),
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                });
                return;
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
        await this.refreshTokenRepository.delete({ user: { id: userId } });
        if (res) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // В DEV! Только в проде true
            });
            res.json({ success: true, message: 'Вы успешно вышли из системы' });
            return;
        }
        return { success: true, message: 'Вы успешно вышли из системы' };
    }
}