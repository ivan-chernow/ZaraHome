import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginService } from '../login.service';
import { AuthRepository } from '../../auth.repository';

type Mock<T> = {
  [K in keyof T]: jest.Mock<any, any>;
};

describe('LoginService (unit)', () => {
  let service: LoginService;
  let authRepository: Mock<AuthRepository>;
  let jwtService: Mock<JwtService>;

  const user = {
    id: 1,
    email: 'john@example.com',
    password: 'hashed',
    role: 'user',
    isEmailVerified: true,
  } as any;

  beforeEach(() => {
    authRepository = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findRefreshTokenByToken: jest.fn(),
      saveRefreshToken: jest.fn(),
      deleteRefreshTokenByUser: jest.fn(),
      deleteRefreshTokenByToken: jest.fn(),
    } as unknown as Mock<AuthRepository>;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as Mock<JwtService>;

    service = new LoginService(
      authRepository as unknown as AuthRepository,
      jwtService as unknown as JwtService
    );
  });

  describe('validateUser', () => {
    it('успех: корректный email + пароль', async () => {
      authRepository.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser('john@example.com', 'password');
      expect(result).toBe(user);
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
    });

    it('ошибка: пустые email/пароль', async () => {
      await expect(service.validateUser('', '')).rejects.toBeInstanceOf(
        UnauthorizedException
      );
    });

    it('ошибка: несуществующий email', async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);
      await expect(service.validateUser('no@ex.com', 'x')).rejects.toThrow(
        'Пользователь не найден'
      );
    });

    it('ошибка: неподтвержденный email', async () => {
      authRepository.findUserByEmail.mockResolvedValue({
        ...user,
        isEmailVerified: false,
      });
      await expect(
        service.validateUser('john@example.com', 'x')
      ).rejects.toThrow('Email не подтвержден');
    });

    it('ошибка: пароль не установлен', async () => {
      authRepository.findUserByEmail.mockResolvedValue({
        ...user,
        password: null,
      });
      await expect(
        service.validateUser('john@example.com', 'x')
      ).rejects.toThrow('Пароль не установлен');
    });

    it('ошибка: неверный пароль', async () => {
      authRepository.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(
        service.validateUser('john@example.com', 'bad')
      ).rejects.toThrow('Неверный пароль');
    });
  });

  describe('login', () => {
    it('генерирует токены, сохраняет refresh и устанавливает cookie', async () => {
      jwtService.sign
        .mockReturnValueOnce('access') // accessToken
        .mockReturnValueOnce('refresh'); // refreshToken

      const res = {
        cookie: jest.fn(),
      } as any;

      const result = await service.login(user, res);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(authRepository.deleteRefreshTokenByUser).toHaveBeenCalledWith(1);
      expect(authRepository.saveRefreshToken).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({ httpOnly: true })
      );
      expect(result).toEqual({
        accessToken: 'access',
        user: { id: 1, email: 'john@example.com', role: 'user' },
      });
    });
  });

  describe('refreshTokens', () => {
    it('валидный refresh: ротация и новый access', async () => {
      jwtService.verify.mockReturnValue({
        sub: 1,
        email: user.email,
        role: user.role,
      });
      authRepository.findUserById.mockResolvedValue(user);
      authRepository.findRefreshTokenByToken.mockResolvedValue({
        token: 'old',
        userId: 1,
      });
      jwtService.sign
        .mockReturnValueOnce('newRefresh')
        .mockReturnValueOnce('newAccess');

      const res = { cookie: jest.fn() } as any;
      const result = await service.refreshTokens('oldRefresh', res);

      expect(authRepository.deleteRefreshTokenByToken).toHaveBeenCalledWith(
        'oldRefresh'
      );
      expect(authRepository.saveRefreshToken).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(result.accessToken).toBe('newAccess');
      expect(result.user).toEqual({
        id: 1,
        email: user.email,
        role: user.role,
      });
    });

    it('ошибка: verify бросает (просрочен/невалиден)', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('expired');
      });
      await expect(service.refreshTokens('bad')).rejects.toThrow(
        'Невалидный refresh token'
      );
    });

    it('ошибка: пользователь не найден', async () => {
      jwtService.verify.mockReturnValue({ sub: 999 });
      authRepository.findUserById.mockResolvedValue(null);
      await expect(service.refreshTokens('some')).rejects.toThrow(
        'Невалидный refresh token'
      );
    });

    it('ошибка: токен не найден в БД', async () => {
      jwtService.verify.mockReturnValue({ sub: 1 });
      authRepository.findUserById.mockResolvedValue(user);
      authRepository.findRefreshTokenByToken.mockResolvedValue(null);
      await expect(service.refreshTokens('some')).rejects.toThrow(
        'Невалидный refresh token'
      );
    });
  });

  describe('logout', () => {
    it('удаляет refresh токены и очищает cookie', async () => {
      const res = { clearCookie: jest.fn() } as any;
      const result = await service.logout(1, res);
      expect(authRepository.deleteRefreshTokenByUser).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ httpOnly: true })
      );
      expect(result).toEqual({
        success: true,
        message: 'Вы успешно вышли из системы',
      });
    });

    it('работает без res (cookie не трогаем)', async () => {
      const result = await service.logout(1);
      expect(authRepository.deleteRefreshTokenByUser).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
    });
  });
});
