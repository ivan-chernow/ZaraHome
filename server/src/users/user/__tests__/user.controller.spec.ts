import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { ResponseService } from '../../../shared/services/response.service';
import { JwtAuthGuard } from '../../../auth/login/jwt/jwt-auth.guard';

describe('UserController (unit)', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;
  let responseService: jest.Mocked<ResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn(),
            changePassword: jest.fn(),
            changeEmail: jest.fn(),
            changeDeliveryAddress: jest.fn(),
            getDeliveryAddresses: jest.fn(),
            addDeliveryAddress: jest.fn(),
            updateDeliveryAddress: jest.fn(),
            deleteDeliveryAddress: jest.fn(),
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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
    responseService = module.get(ResponseService);
  });

  describe('getProfile', () => {
    it('получение профиля пользователя', async () => {
      const user = { id: 1, email: 'test@test.com', name: 'Test User' };
      const mockReq = { user: { id: 1 } } as any;

      userService.getProfile.mockResolvedValue(user as any);
      responseService.success.mockReturnValue({ success: true, message: 'test' });

      const result = await controller.getProfile(mockReq);

      expect(userService.getProfile).toHaveBeenCalledWith(1);
      expect(responseService.success).toHaveBeenCalledWith(user, 'Профиль пользователя загружен');
      expect(result).toEqual({ success: true, message: 'test' });
    });
  });

  describe('changePassword', () => {
    it('изменение пароля пользователя', async () => {
      const passwordData = { currentPassword: 'old', newPassword: 'new' };
      const result = { success: true };
      const mockReq = { user: { id: 1 } } as any;

      userService.changePassword.mockResolvedValue(result as any);
      responseService.success.mockReturnValue({ success: true, message: 'test' });

      const response = await controller.changePassword(mockReq, passwordData);

      expect(userService.changePassword).toHaveBeenCalledWith(1, passwordData);
      expect(responseService.success).toHaveBeenCalledWith(result, 'Пароль успешно изменен');
      expect(response).toEqual({ success: true, message: 'test' });
    });
  });

  describe('addDeliveryAddress', () => {
    it('добавление адреса доставки', async () => {
      const addressData = { 
        firstName: 'John', 
        lastName: 'Doe', 
        phone: '+1234567890',
        region: 'Test Region',
        city: 'Test City',
        street: 'Test Street',
        house: '123'
      };
      const newAddress = { id: 1, ...addressData };
      const mockReq = { user: { id: 1 } } as any;

      userService.addDeliveryAddress.mockResolvedValue(newAddress as any);
      responseService.success.mockReturnValue({ success: true, message: 'test' });

      const result = await controller.addDeliveryAddress(mockReq, addressData);

      expect(userService.addDeliveryAddress).toHaveBeenCalledWith(1, addressData);
      expect(responseService.success).toHaveBeenCalledWith(newAddress, 'Адрес доставки успешно добавлен');
      expect(result).toEqual({ success: true, message: 'test' });
    });
  });
});
