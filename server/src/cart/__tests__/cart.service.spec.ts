import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart.services';

type Mock<T> = { [K in keyof T]: jest.Mock<any, any> };

describe('CartService (unit)', () => {
  let service: CartService;
  let repo: Mock<any>;
  let users: Mock<any>;
  let products: Mock<any>;
  let cache: Mock<any>;

  beforeEach(() => {
    repo = {
      findByUserAndProduct: jest.fn(),
      create: jest.fn(),
      removeByUserAndProduct: jest.fn(),
      findByUserWithProductDetails: jest.fn(),
      findByUser: jest.fn(),
      removeByUser: jest.fn(),
      findByUserAndProducts: jest.fn(),
      countByUser: jest.fn(),
    } as any;
    users = { findOne: jest.fn() } as any;
    products = { findOne: jest.fn() } as any;
    cache = {
      getOrSet: jest.fn((k: string, f: () => any) => f()),
      delete: jest.fn(),
    } as any;
    service = new CartService(
      repo as any,
      users as any,
      products as any,
      cache as any
    );
  });

  it('addToCart: валидирует и создаёт', async () => {
    users.findOne.mockResolvedValue({ id: 1 });
    products.findOne.mockResolvedValue({ id: 2 });
    repo.findByUserAndProduct.mockResolvedValue(null);
    repo.create.mockResolvedValue({
      id: 10,
      user: { id: 1 },
      product: { id: 2 },
      createdAt: new Date(),
    });
    const res = await service.addToCart(1, 2);
    expect(res.userId).toBe(1);
    expect(res.productId).toBe(2);
  });

  it('addToCart: должен увеличить количество если товар уже в корзине', async () => {
    const existingItem = {
      id: 1,
      user: { id: 1 },
      product: { id: 1 },
      createdAt: new Date(),
    };

    users.findOne.mockResolvedValue({ id: 1 });
    products.findOne.mockResolvedValue({ id: 1, price: 100 });
    repo.findByUserAndProduct.mockResolvedValue(existingItem);
    repo.create.mockResolvedValue({ ...existingItem });

    const result = await service.addToCart(1, 1);
    expect(result).toBeDefined();
  });

  it('addToCart: должен выбросить ошибку если пользователь не найден', async () => {
    users.findOne.mockResolvedValue(null);

    await expect(service.addToCart(999, 1)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('addToCart: должен выбросить ошибку если товар не найден', async () => {
    users.findOne.mockResolvedValue({ id: 1 });
    products.findOne.mockResolvedValue(null);

    await expect(service.addToCart(1, 999)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('removeFromCart: должен удалить товар из корзины', async () => {
    const existingItem = { id: 1, user: { id: 1 }, product: { id: 1 } };
    repo.findByUserAndProduct.mockResolvedValue(existingItem);
    repo.removeByUserAndProduct.mockResolvedValue({ affected: 1 });

    await service.removeFromCart(1, 1);
    expect(repo.removeByUserAndProduct).toHaveBeenCalledWith(1, 1);
  });

  it('getUserCart: должен вернуть корзину пользователя с деталями товаров', async () => {
    const cartItems = [
      {
        id: 1,
        user: { id: 1 },
        product: {
          id: 1,
          name_ru: 'Товар 1',
          name_eng: 'Product 1',
          img: [],
          colors: [],
          size: [],
          deliveryDate: '2024-12-31',
          description: 'Описание',
          isNew: false,
          discount: 0,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      },
      {
        id: 2,
        user: { id: 1 },
        product: {
          id: 2,
          name_ru: 'Товар 2',
          name_eng: 'Product 2',
          img: [],
          colors: [],
          size: [],
          deliveryDate: '2024-12-31',
          description: 'Описание',
          isNew: false,
          discount: 0,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
      },
    ];

    repo.findByUserWithProductDetails.mockResolvedValue(cartItems);
    cache.getOrSet.mockImplementation((key, fn) => fn());

    const result = await service.getUserCart(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[0].product.name_ru).toBe('Товар 1');
  });

  it('clearUserCart: должен очистить всю корзину пользователя', async () => {
    const cartItems = [
      { id: 1, user: { id: 1 }, product: { id: 1 } },
      { id: 2, user: { id: 1 }, product: { id: 2 } },
    ];
    repo.findByUser.mockResolvedValue(cartItems);
    repo.removeByUser.mockResolvedValue({ affected: 3 });

    await service.clearCart(1);
    expect(repo.removeByUser).toHaveBeenCalledWith(1);
  });

  it('addToCart: ошибки валидации', async () => {
    await expect(service.addToCart(0, 0)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('removeFromCart: 404 если нет', async () => {
    repo.findByUserAndProduct.mockResolvedValue(null);
    await expect(service.removeFromCart(1, 2)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});
