import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResetPasswordService } from '../reset-password.service';
import { EmailService } from '../../../email/email.service';

type Mock<T> = {
  [K in keyof T]: jest.Mock<any, any>;
};

describe('ResetPasswordService (unit)', () => {
  let service: ResetPasswordService;
  let resetRepository: Mock<Repository<any>>;
  let userRepository: Mock<Repository<any>>;
  let emailService: Mock<EmailService>;

  beforeEach(() => {
    resetRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    } as unknown as Mock<Repository<any>>;

    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as Mock<Repository<any>>;

    emailService = {
      sendResetPasswordEmail: jest.fn(),
    } as unknown as Mock<EmailService>;

    service = new ResetPasswordService(
      resetRepository as unknown as Repository<any>,
      userRepository as unknown as Repository<any>,
      emailService as unknown as EmailService
    );
  });

  describe('requestReset', () => {
    it('проверяет пользователя, ограничивает частоту, сохраняет токен и шлёт письмо', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'a@a.a',
        isEmailVerified: true,
      });
      resetRepository.findOne.mockResolvedValue(null);
      resetRepository.delete.mockResolvedValue(undefined);
      resetRepository.save.mockResolvedValue(undefined);

      await service.requestReset('a@a.a');

      expect(resetRepository.delete).toHaveBeenCalledWith({ email: 'a@a.a' });
      expect(resetRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'a@a.a',
          token: expect.any(String),
          expiresAt: expect.any(Date),
          createdAt: expect.any(Date),
        })
      );
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(
        'a@a.a',
        expect.any(String)
      );
    });

    it('ошибка: пользователь не найден/не верифицирован', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.requestReset('no@a.a')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });

    it('ошибка: rate-limit 15 минут', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'a@a.a',
        isEmailVerified: true,
      });
      resetRepository.findOne.mockResolvedValue({ createdAt: new Date() });
      await expect(service.requestReset('a@a.a')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });
  });

  describe('verifyCode', () => {
    it('валидный токен', async () => {
      const rec = { token: 't', expiresAt: new Date(Date.now() + 60000) };
      resetRepository.findOne.mockResolvedValue(rec);
      resetRepository.save.mockResolvedValue(undefined);
      const token = await service.verifyCode('t');
      expect(token).toBe('t');
      expect(resetRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isVerified: true })
      );
    });

    it('ошибка: неверный/просроченный токен', async () => {
      resetRepository.findOne.mockResolvedValue(null);
      await expect(service.verifyCode('bad')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });
  });

  describe('setNewPassword', () => {
    it('устанавливает новый пароль, удаляет запись reset и запрещает повторное использование токена', async () => {
      const rec = { token: 't', email: 'a@a.a', isVerified: true };
      resetRepository.findOne.mockResolvedValue(rec);
      userRepository.findOne.mockResolvedValue({ id: 1, email: 'a@a.a' });
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');
      userRepository.save.mockResolvedValue(undefined);
      resetRepository.remove.mockResolvedValue(undefined);

      const result = await service.setNewPassword('t', 'newpass');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed' })
      );
      expect(resetRepository.remove).toHaveBeenCalledWith(rec);
      expect(result).toEqual({
        success: true,
        message: 'Пароль успешно изменен',
      });

      // повторное использование токена должно провалиться
      resetRepository.findOne.mockResolvedValue(null);
      await expect(service.setNewPassword('t', 'again')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });

    it('ошибка: недействительный токен', async () => {
      resetRepository.findOne.mockResolvedValue(null);
      await expect(service.setNewPassword('bad', 'x')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });

    it('ошибка: пользователь не найден', async () => {
      resetRepository.findOne.mockResolvedValue({
        token: 't',
        email: 'a@a.a',
        isVerified: true,
      });
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.setNewPassword('t', 'x')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });
  });
});
