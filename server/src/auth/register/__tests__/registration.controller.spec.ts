import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from '../register.controller';
import { RegistrationService } from '../register.service';
import { ResponseService } from '../../../shared/services/response.service';

describe('RegistrationController (unit)', () => {
  let controller: RegistrationController;
  let registrationService: jest.Mocked<RegistrationService>;
  let responseService: jest.Mocked<ResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: RegistrationService,
          useValue: {
            initiateRegistration: jest.fn(),
            verifyByCode: jest.fn(),
            completeRegistration: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            success: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegistrationController>(RegistrationController);
    registrationService = module.get(RegistrationService);
    responseService = module.get(ResponseService);
  });

  describe('initiate', () => {
    it('инициация регистрации', async () => {
      const initiateData = { email: 'test@test.com' };

      registrationService.initiateRegistration.mockResolvedValue(undefined);
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      const result = await controller.initiate(initiateData);

      expect(registrationService.initiateRegistration).toHaveBeenCalledWith(
        'test@test.com'
      );
      expect(responseService.success).toHaveBeenCalledWith(
        undefined,
        'Код подтверждения отправлен на email test@test.com'
      );
      expect(result).toEqual({ success: true, message: 'test' });
    });
  });

  describe('verifyCode', () => {
    it('верификация кода', async () => {
      const verifyData = { email: 'test@test.com', code: '123456' };
      const sessionToken = 'session-token';

      registrationService.verifyByCode.mockResolvedValue(sessionToken);
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      const result = await controller.verifyCode(verifyData);

      expect(registrationService.verifyByCode).toHaveBeenCalledWith(
        'test@test.com',
        '123456'
      );
      expect(responseService.success).toHaveBeenCalledWith(
        { sessionToken },
        'Код подтверждения валиден'
      );
      expect(result).toEqual({ success: true, message: 'test' });
    });
  });

  describe('complete', () => {
    it('завершение регистрации', async () => {
      const completeData = {
        sessionToken: 'session-token',
        password: 'password',
      };
      const user = { id: 1, email: 'test@test.com' };

      registrationService.completeRegistration.mockResolvedValue(user as any);
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      const result = await controller.complete(completeData);

      expect(registrationService.completeRegistration).toHaveBeenCalledWith(
        'session-token',
        'password'
      );
      expect(responseService.success).toHaveBeenCalledWith(
        { user },
        'Регистрация завершена для пользователя test@test.com'
      );
      expect(result).toEqual({ success: true, message: 'test' });
    });
  });
});
