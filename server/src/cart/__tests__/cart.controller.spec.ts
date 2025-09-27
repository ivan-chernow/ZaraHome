import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.services';
import { ResponseService } from '../../shared/services/response.service';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';

describe('CartController (unit)', () => {
  let controller: CartController;
  let cartService: jest.Mocked<CartService>;
  let responseService: jest.Mocked<ResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            addToCart: jest.fn(),
            removeFromCart: jest.fn(),
            getUserCart: jest.fn(),
            clearCart: jest.fn(),
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

    controller = module.get<CartController>(CartController);
    cartService = module.get(CartService);
    responseService = module.get(ResponseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('должен добавить товар в корзину', async () => {
      const productId = 1;
      const userId = 1;
      const mockResult = { id: 1, productId: 1, quantity: 1, userId: 1 };

      cartService.addToCart.mockResolvedValue(mockResult as any);
      responseService.success.mockReturnValue({
        success: true,
        data: mockResult,
        message: 'Товар добавлен в корзину',
      });

      const result = await controller.add({ user: { id: userId } } as any, {
        productId,
      });

      expect(cartService.addToCart).toHaveBeenCalledWith(userId, productId);
      expect(responseService.success).toHaveBeenCalledWith(
        mockResult,
        'Товар добавлен в корзину'
      );
      expect(result).toEqual({
        success: true,
        data: mockResult,
        message: 'Товар добавлен в корзину',
      });
    });
  });

  describe('getUserCart', () => {
    it('должен получить корзину пользователя', async () => {
      const userId = 1;
      const mockCart = [{ id: 1, productId: 1, quantity: 2 }];

      cartService.getUserCart.mockResolvedValue(mockCart as any);
      responseService.success.mockReturnValue({
        success: true,
        data: mockCart,
        message: 'Корзина загружена',
      });

      const result = await controller.getUserCart({
        user: { id: userId },
      } as any);

      expect(cartService.getUserCart).toHaveBeenCalledWith(userId);
      expect(responseService.success).toHaveBeenCalledWith(
        mockCart,
        'Корзина загружена'
      );
      expect(result).toEqual({
        success: true,
        data: mockCart,
        message: 'Корзина загружена',
      });
    });
  });

  describe('remove', () => {
    it('должен удалить товар из корзины', async () => {
      const productId = 1;
      const userId = 1;

      cartService.removeFromCart.mockResolvedValue(undefined);
      responseService.success.mockReturnValue({
        success: true,
        data: undefined,
        message: 'Товар удален из корзины',
      });

      const result = await controller.remove({ user: { id: userId } } as any, {
        productId,
      });

      expect(cartService.removeFromCart).toHaveBeenCalledWith(
        userId,
        productId
      );
      expect(responseService.success).toHaveBeenCalledWith(
        undefined,
        'Товар удален из корзины'
      );
      expect(result).toEqual({
        success: true,
        data: undefined,
        message: 'Товар удален из корзины',
      });
    });
  });

  describe('clearCart', () => {
    it('должен очистить корзину', async () => {
      const userId = 1;

      cartService.clearCart.mockResolvedValue(undefined);
      responseService.success.mockReturnValue({
        success: true,
        data: undefined,
        message: 'Корзина очищена',
      });

      const result = await controller.clearCart({
        user: { id: userId },
      } as any);

      expect(cartService.clearCart).toHaveBeenCalledWith(userId);
      expect(responseService.success).toHaveBeenCalledWith(
        undefined,
        'Корзина очищена'
      );
      expect(result).toEqual({
        success: true,
        data: undefined,
        message: 'Корзина очищена',
      });
    });
  });
});
