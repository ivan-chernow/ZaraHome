import { BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegistrationService } from '../register.service';
import { EmailService } from '../../../email/email.service';

type Mock<T> = {
  [K in keyof T]: jest.Mock<any, any>;
};

describe('RegistrationService (unit)', () => {
  let service: RegistrationService;
  let userRepository: Mock<Repository<any>>;
  let verificationRepository: Mock<Repository<any>>;
  let emailService: Mock<EmailService>;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as Mock<Repository<any>>;

    verificationRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    } as unknown as Mock<Repository<any>>;

    emailService = {
      sendVerificationCodeEmail: jest.fn(),
      sendWelcomeUser: jest.fn(),
    } as unknown as Mock<EmailService>;

    service = new RegistrationService(
      userRepository as unknown as Repository<any>,
      verificationRepository as unknown as Repository<any>,
      emailService as unknown as EmailService
    );
  });

  describe('initiateRegistration', () => {
    it('генерирует код, сохраняет запись, ограничивает по частоте, отправляет email', async () => {
      userRepository.findOne.mockResolvedValue(null);
      verificationRepository.findOne = jest.fn().mockResolvedValue(null);
      verificationRepository.delete.mockResolvedValue(undefined);
      verificationRepository.save.mockResolvedValue(undefined);

      await service.initiateRegistration('john@example.com');

      expect(verificationRepository.delete).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
      expect(verificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          code: expect.any(String),
          token: expect.any(String),
          expiresAt: expect.any(Date),
          createdAt: expect.any(Date),
        })
      );
      expect(emailService.sendVerificationCodeEmail).toHaveBeenCalledWith(
        'john@example.com',
        expect.any(String)
      );
    });

    it('ошибка: пользователь уже существует (верифицирован)', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        isEmailVerified: true,
      });
      await expect(
        service.initiateRegistration('exists@example.com')
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('ошибка: превышен лимит частоты (5 минут)', async () => {
      userRepository.findOne.mockResolvedValue(null);
      verificationRepository.findOne = jest
        .fn()
        .mockResolvedValue({ createdAt: new Date() });
      await expect(
        service.initiateRegistration('rate@example.com')
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('verifyByCode', () => {
    it('успех: валидный код', async () => {
      const rec = {
        email: 'john@example.com',
        code: '123456',
        token: 'sess',
        expiresAt: new Date(Date.now() + 60000),
      };
      verificationRepository.findOne.mockResolvedValue(rec);
      verificationRepository.save.mockResolvedValue(undefined);

      const token = await service.verifyByCode('john@example.com', '123456');
      expect(token).toBe('sess');
      expect(verificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isVerified: true })
      );
    });

    it('ошибка: неверный/просроченный код', async () => {
      verificationRepository.findOne.mockResolvedValue(null);
      await expect(
        service.verifyByCode('a@a.a', '000000')
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('completeRegistration', () => {
    it('создаёт пользователя при валидном токене, хеширует пароль и шлёт welcome', async () => {
      const ver = { token: 't', email: 'john@example.com', isVerified: true };
      verificationRepository.findOne.mockResolvedValue(ver);
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ email: 'john@example.com' });
      userRepository.save.mockImplementation(async u => ({ id: 1, ...u }));
      verificationRepository.remove.mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

      const _user = await service.completeRegistration('t', 'pass');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          password: 'hashed',
        })
      );
      expect(emailService.sendWelcomeUser).toHaveBeenCalledWith(
        'john@example.com'
      );
    });

    it('апдейт существующего пользователя', async () => {
      const ver = { token: 't', email: 'john@example.com', isVerified: true };
      verificationRepository.findOne.mockResolvedValue(ver);
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'john@example.com',
      });
      userRepository.save.mockResolvedValue({
        id: 1,
        email: 'john@example.com',
      });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

      await service.completeRegistration('t', 'pass');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed', isEmailVerified: true })
      );
    });

    it('ошибка: неверный или просроченный токен', async () => {
      verificationRepository.findOne.mockResolvedValue(null);
      await expect(
        service.completeRegistration('bad', 'x')
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
