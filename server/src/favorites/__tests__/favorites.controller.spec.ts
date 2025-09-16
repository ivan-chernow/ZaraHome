import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from '../favorites.controller';
import { FavoritesService } from '../favorites.service';
import { ResponseService } from '../../shared/services/response.service';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';

describe('FavoritesController (unit)', () => {
  let controller: FavoritesController;
  let favoritesService: jest.Mocked<FavoritesService>;
  let responseService: jest.Mocked<ResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            add: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            clearFavorites: jest.fn(),
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

    controller = module.get<FavoritesController>(FavoritesController);
    favoritesService = module.get(FavoritesService);
    responseService = module.get(ResponseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('должен добавить товар в избранное', async () => {
      const productId = 1;
      const userId = 1;
      const mockResult = { id: 1, productId: 1, userId: 1 };

      favoritesService.add.mockResolvedValue(mockResult as any);
      responseService.success.mockReturnValue({ success: true, data: mockResult, message: 'Товар добавлен в избранное' });

      const result = await controller.add({ productId }, { user: { id: userId } } as any);

      expect(favoritesService.add).toHaveBeenCalledWith(userId, productId);
      expect(responseService.success).toHaveBeenCalledWith(mockResult, 'Товар добавлен в избранное');
      expect(result).toEqual({ success: true, data: mockResult, message: 'Товар добавлен в избранное' });
    });
  });

  describe('findAll', () => {
    it('должен получить избранные товары пользователя', async () => {
      const userId = 1;
      const mockFavorites = [{ id: 1, productId: 1, product: { name: 'Test Product' } }];

      favoritesService.findAll.mockResolvedValue(mockFavorites as any);
      responseService.success.mockReturnValue({ success: true, data: mockFavorites, message: 'Избранное загружено' });

      const result = await controller.findAll({ user: { id: userId } } as any);

      expect(favoritesService.findAll).toHaveBeenCalledWith(userId);
      expect(responseService.success).toHaveBeenCalledWith(mockFavorites, 'Избранное загружено');
      expect(result).toEqual({ success: true, data: mockFavorites, message: 'Избранное загружено' });
    });
  });

  describe('remove', () => {
    it('должен удалить товар из избранного', async () => {
      const productId = 1;
      const userId = 1;

      favoritesService.remove.mockResolvedValue(undefined);
      responseService.success.mockReturnValue({ success: true, data: undefined, message: 'Товар удален из избранного' });

      const result = await controller.remove({ productId }, { user: { id: userId } } as any);

      expect(favoritesService.remove).toHaveBeenCalledWith(userId, productId);
      expect(responseService.success).toHaveBeenCalledWith(undefined, 'Товар удален из избранного');
      expect(result).toEqual({ success: true, data: undefined, message: 'Товар удален из избранного' });
    });
  });

  describe('clearFavorites', () => {
    it('должен очистить избранное', async () => {
      const userId = 1;

      favoritesService.clearFavorites.mockResolvedValue(undefined);
      responseService.success.mockReturnValue({ success: true, data: undefined, message: 'Избранное очищено' });

      const result = await controller.clearFavorites({ user: { id: userId } } as any);

      expect(favoritesService.clearFavorites).toHaveBeenCalledWith(userId);
      expect(responseService.success).toHaveBeenCalledWith(undefined, 'Избранное очищено');
      expect(result).toEqual({ success: true, data: undefined, message: 'Избранное очищено' });
    });
  });
});