import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { LoginController } from '../login.controller';
import { LoginService } from '../login.service';
import { ResponseService } from '../../../shared/services/response.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

describe('LoginController (unit)', () => {
  let controller: LoginController;
  let loginService: jest.Mocked<LoginService>;
  let responseService: jest.Mocked<ResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshTokens: jest.fn(),
            logout: jest.fn(),
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

    controller = module.get<LoginController>(LoginController);
    loginService = module.get(LoginService);
    responseService = module.get(ResponseService);
  });

  describe('login', () => {
    it('успешный логин', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const user = { id: 1, email: 'test@test.com' };
      const loginResult = { accessToken: 'token', user };
      const mockRes = { json: jest.fn() } as unknown as Response;

      loginService.validateUser.mockResolvedValue(user as any);
      loginService.login.mockResolvedValue(loginResult as any);
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      await controller.login(loginDto, mockRes);

      expect(loginService.validateUser).toHaveBeenCalledWith(
        'test@test.com',
        'password'
      );
      expect(loginService.login).toHaveBeenCalledWith(user, mockRes);
      expect(responseService.success).toHaveBeenCalledWith(
        loginResult,
        'Успешная авторизация'
      );
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('успешное обновление токенов', async () => {
      const refreshDto: RefreshTokenDto = { refreshToken: 'refresh-token' };
      const mockReq = { cookies: { refreshToken: 'refresh-token' } } as Request;
      const mockRes = { json: jest.fn() } as unknown as Response;
      const refreshResult = { accessToken: 'new-token' };

      loginService.refreshTokens.mockResolvedValue(refreshResult as any);
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      await controller.refresh(mockReq, refreshDto, mockRes);

      expect(loginService.refreshTokens).toHaveBeenCalledWith(
        'refresh-token',
        mockRes
      );
      expect(responseService.success).toHaveBeenCalledWith(
        refreshResult,
        'Токены обновлены'
      );
    });

    it('ошибка при отсутствии refresh token', async () => {
      const refreshDto: RefreshTokenDto = {};
      const mockReq = { cookies: {} } as Request;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      responseService.error.mockReturnValue({
        success: false,
        message: 'Refresh token is required',
      });

      await controller.refresh(mockReq, refreshDto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(responseService.error).toHaveBeenCalledWith(
        'Refresh token is required'
      );
    });
  });

  describe('logout', () => {
    it('успешный выход', async () => {
      const mockReq = { user: { id: 1 } } as Request & { user: { id: number } };
      const mockRes = { json: jest.fn() } as unknown as Response;

      loginService.logout.mockResolvedValue({ success: true, message: 'test' });
      responseService.success.mockReturnValue({
        success: true,
        message: 'test',
      });

      await controller.logout(mockReq, mockRes);

      expect(loginService.logout).toHaveBeenCalledWith(1, mockRes);
      expect(responseService.success).toHaveBeenCalledWith(
        undefined,
        'Успешный выход'
      );
    });
  });
});
