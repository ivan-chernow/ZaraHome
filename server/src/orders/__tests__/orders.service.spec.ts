import { BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders.service';

type Mock<T> = { [K in keyof T]: jest.Mock<any, any> };

describe('OrdersService (unit)', () => {
  let service: OrdersService;
  let repo: Mock<any>;
  let promocodes: Mock<any>;

  beforeEach(() => {
    repo = {
      findUserById: jest.fn(),
      findActiveOrderByUser: jest.fn(),
      updateOrder: jest.fn(),
      createOrder: jest.fn(),
      findOrdersByUser: jest.fn(),
      findOrderByIdAndUser: jest.fn(),
      updateOrderStatus: jest.fn(),
      getOrdersByStatus: jest.fn(),
      getOrdersStatistics: jest.fn(),
      searchOrders: jest.fn(),
    } as any;
    promocodes = {
      validateAndApply: jest.fn(),
    } as any;
    service = new OrdersService(repo as any, promocodes as any);
  });

  it('createOrder: валидирует, учитывает активный заказ, считает тоталы и применяет промокод', async () => {
    const dto = {
      items: [
        { productId: 1, quantity: 2, price: 100 },
        { productId: 2, quantity: 1, price: 50 },
      ],
      promocode: 'SALE10',
    } as any;

    repo.findUserById.mockResolvedValue({ id: 1 });
    repo.findActiveOrderByUser.mockResolvedValue(null);
    promocodes.validateAndApply.mockResolvedValue({
      isValid: true,
      finalAmount: 225,
      discount: 25,
    });
    repo.createOrder.mockResolvedValue({
      id: 10,
      totalPrice: 225,
      totalCount: 3,
    });

    const order = await service.createOrder(dto, 1);
    expect(order.totalPrice).toBe(225);
    expect(order.totalCount).toBe(3);
  });

  it('createOrder: должен отменить существующий активный заказ при изменении товаров', async () => {
    const dto = {
      items: [
        { productId: 1, quantity: 2, price: 100 },
        { productId: 2, quantity: 1, price: 50 },
      ],
    } as any;

    const existingOrder = {
      id: 5,
      status: 'PENDING',
      items: [{ productId: 1, quantity: 1, price: 100 }],
    };

    repo.findUserById.mockResolvedValue({ id: 1 });
    repo.findActiveOrderByUser.mockResolvedValue(existingOrder);
    repo.updateOrder.mockResolvedValue({
      ...existingOrder,
      status: 'CANCELLED',
    });
    repo.createOrder.mockResolvedValue({
      id: 10,
      totalPrice: 250,
      totalCount: 3,
    });

    await service.createOrder(dto, 1);

    expect(repo.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled' })
    );
    expect(repo.createOrder).toHaveBeenCalled();
  });

  it('createOrder: должен вернуть существующий заказ если товары не изменились', async () => {
    const dto = {
      items: [{ productId: 1, quantity: 1, price: 100 }],
    } as any;

    const existingOrder = {
      id: 5,
      status: 'PENDING',
      items: [{ productId: 1, quantity: 1, price: 100 }],
    };

    repo.findUserById.mockResolvedValue({ id: 1 });
    repo.findActiveOrderByUser.mockResolvedValue(existingOrder);

    const result = await service.createOrder(dto, 1);

    expect(result).toBe(existingOrder);
    expect(repo.createOrder).not.toHaveBeenCalled();
  });

  it('createOrder: должен обработать невалидный промокод', async () => {
    const dto = {
      items: [{ productId: 1, quantity: 2, price: 100 }],
      promocode: 'INVALID',
    } as any;

    repo.findUserById.mockResolvedValue({ id: 1 });
    repo.findActiveOrderByUser.mockResolvedValue(null);
    promocodes.validateAndApply.mockResolvedValue({
      isValid: false,
      message: 'Промокод не найден',
    });
    repo.createOrder.mockResolvedValue({
      id: 10,
      totalPrice: 200,
      totalCount: 2,
    });

    const order = await service.createOrder(dto, 1);

    expect(order.totalPrice).toBe(200); // Без скидки
    expect(promocodes.validateAndApply).toHaveBeenCalledWith('INVALID', 200, 1);
  });

  it('getUserOrders: некорректная пагинация', async () => {
    await expect(service.getUserOrders(1, 0, 10)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('searchOrders: короткая строка', async () => {
    await expect(service.searchOrders('a')).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('updateOrderStatus: валидирует переход статуса', async () => {
    repo.findOrderByIdAndUser.mockResolvedValue({ id: 1, status: 'delivered' });
    await expect(
      service.updateOrderStatus(1, 'paid' as any, 1)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getUserOrders: успешный вызов репозитория', async () => {
    repo.findOrdersByUser.mockResolvedValue({
      orders: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
    const res = await service.getUserOrders(1, 1, 10);
    expect(res.page).toBe(1);
  });
});
