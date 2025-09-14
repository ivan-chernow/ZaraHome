import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordController } from '../reset-password.controller';
import { ResetPasswordService } from '../reset-password.service';
import { ResponseService } from 'src/shared/services/response.service';
import { ResetRequestDto, ResetSetDto, ResetVerifyDto } from '../dto/reset-password.dto';

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController;
  let _resetService: ResetPasswordService;
  let _responseService: ResponseService;

  const mockResetService = {
    requestReset: jest.fn(),
    verifyCode: jest.fn(),
    setNewPassword: jest.fn(),
  };

  const mockResponseService = {
    success: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [
        {
          provide: ResetPasswordService,
          useValue: mockResetService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
    _resetService = module.get<ResetPasswordService>(ResetPasswordService);
    _responseService = module.get<ResponseService>(ResponseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('request', () => {
    it('should request password reset successfully', async () => {
      const dto: ResetRequestDto = { email: 'test@example.com' };
      const expectedResponse = { message: 'Код для сброса пароля отправлен на email test@example.com' };

      mockResetService.requestReset.mockResolvedValue(undefined);
      mockResponseService.success.mockReturnValue(expectedResponse);

      const result = await controller.request(dto);

      expect(mockResetService.requestReset).toHaveBeenCalledWith(dto.email);
      expect(mockResponseService.success).toHaveBeenCalledWith(
        undefined,
        'Код для сброса пароля отправлен на email test@example.com'
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('verify', () => {
    it('should verify reset code successfully', async () => {
      const dto: ResetVerifyDto = { token: 'valid-token' };
      const verifiedToken = 'verified-token';
      const expectedResponse = { token: verifiedToken };

      mockResetService.verifyCode.mockResolvedValue(verifiedToken);
      mockResponseService.success.mockReturnValue(expectedResponse);

      const result = await controller.verify(dto);

      expect(mockResetService.verifyCode).toHaveBeenCalledWith(dto.token);
      expect(mockResponseService.success).toHaveBeenCalledWith(
        { token: verifiedToken },
        'Код подтверждения подтвержден'
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('verifyInfo', () => {
    it('should return info for GET request with token', async () => {
      const token = 'test-token';
      const expectedResponse = {
        info: 'Use POST /auth/reset-password/verify with { email, token }',
        token: token,
      };

      mockResponseService.success.mockReturnValue(expectedResponse);

      const result = await controller.verifyInfo(token);

      expect(mockResponseService.success).toHaveBeenCalledWith(
        {
          info: 'Use POST /auth/reset-password/verify with { email, token }',
          token: token,
        },
        'Endpoint is alive'
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should return info for GET request without token', async () => {
      const expectedResponse = {
        info: 'Use POST /auth/reset-password/verify with { email, token }',
        token: null,
      };

      mockResponseService.success.mockReturnValue(expectedResponse);

      const result = await controller.verifyInfo();

      expect(mockResponseService.success).toHaveBeenCalledWith(
        {
          info: 'Use POST /auth/reset-password/verify with { email, token }',
          token: null,
        },
        'Endpoint is alive'
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('set', () => {
    it('should set new password successfully', async () => {
      const dto: ResetSetDto = { token: 'valid-token', password: 'newPassword123' };
      const expectedResponse = { message: 'Пароль успешно изменен' };

      mockResetService.setNewPassword.mockResolvedValue(undefined);
      mockResponseService.success.mockReturnValue(expectedResponse);

      const result = await controller.set(dto);

      expect(mockResetService.setNewPassword).toHaveBeenCalledWith(dto.token, dto.password);
      expect(mockResponseService.success).toHaveBeenCalledWith(
        undefined,
        'Пароль успешно изменен'
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
