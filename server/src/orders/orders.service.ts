import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ResourceNotFoundException } from 'src/shared/shared.interfaces';
import { Order } from './entity/order.entity';
import { OrderStatus } from 'src/shared/shared.interfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository, OrderListResponse } from './orders.repository';
import { IOrderService, OrderItem } from 'src/shared/shared.interfaces';
import { PromocodesService } from '../promocodes/promocodes.service';
import { ORDERS_CONSTANTS } from './orders.constants';

export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

@Injectable()
export class OrdersService implements IOrderService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly promocodesService: PromocodesService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    // Валидация входных данных
    this.validateCreateOrderDto(createOrderDto);

    // Получаем пользователя через репозиторий
    const user = await this.ordersRepository.findUserById(userId);
    if (!user) {
      throw new ResourceNotFoundException('Пользователь', userId);
    }

    // Проверяем, есть ли уже активный заказ у пользователя
    const existingActiveOrder = await this.ordersRepository.findActiveOrderByUser(userId);

    // Если есть активный заказ, проверяем, изменились ли товары
    if (existingActiveOrder) {
      const currentItems = existingActiveOrder.items;
      const newItems = createOrderDto.items;
      
      // Проверяем, одинаковые ли товары и количества
      const itemsChanged = this.haveItemsChanged(currentItems, newItems);
      
      // Если товары не изменились, возвращаем существующий заказ
      if (!itemsChanged) {
        return existingActiveOrder;
      }
      
      // Если товары изменились, отменяем старый заказ
      existingActiveOrder.status = OrderStatus.CANCELLED;
      await this.ordersRepository.updateOrder(existingActiveOrder);
    }

    // Рассчитываем общую стоимость и количество
    const { totalPrice, totalCount } = this.calculateOrderTotals(createOrderDto.items);

    // Применяем промокод, если указан
    let finalPrice = totalPrice;
    let discount = 0;
    let promocode: string | null = null;

    if (createOrderDto.promocode) {
      const promocodeResult = await this.promocodesService.validateAndApply(
        createOrderDto.promocode,
        totalPrice,
        userId
      );

      if (promocodeResult.isValid && promocodeResult.finalAmount !== undefined && promocodeResult.discount !== undefined) {
        finalPrice = promocodeResult.finalAmount;
        discount = promocodeResult.discount;
        promocode = createOrderDto.promocode;
      }
    }

    // Создаем новый заказ
    const order = await this.ordersRepository.createOrder({
      ...createOrderDto,
      user,
      status: OrderStatus.PENDING,
      totalPrice: finalPrice,
      totalCount,
      discount,
      promocode,
    });

    return order;
  }

  async getUserOrders(userId: number, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Некорректные параметры пагинации');
    }

    return await this.ordersRepository.findOrdersByUser(userId, page, limit);
  }

  async getActiveOrder(userId: number): Promise<Order | null> {
    return await this.ordersRepository.findActiveOrderByUser(userId);
  }

  async getOrderById(orderId: number, userId: number): Promise<Order | null> {
    return await this.ordersRepository.findOrderByIdAndUser(orderId, userId);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);
    if (!order) {
      throw new ResourceNotFoundException('Заказ', orderId);
    }

    // Проверяем, можно ли изменить статус
    this.validateStatusTransition(order.status, status);

    await this.ordersRepository.updateOrderStatus(orderId, status);
    order.status = status;
    return order;
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED, userId);
  }

  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);
    if (!order) {
      throw new ResourceNotFoundException('Заказ', orderId);
    }

    // Проверяем, можно ли редактировать заказ
    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Нельзя редактировать заказ, который не в статусе "Ожидает"');
    }

    // Валидация обновляемых данных
    this.validateUpdateOrderDto(updateOrderDto);

    // Обновляем только переданные поля
    if (updateOrderDto.address !== undefined) {
      order.address = updateOrderDto.address;
    }
    if (updateOrderDto.phone !== undefined) {
      order.phone = updateOrderDto.phone;
    }
    if (updateOrderDto.comment !== undefined) {
      order.comment = updateOrderDto.comment;
    }

    return await this.ordersRepository.updateOrder(order);
  }

  async getOrdersByStatus(status: OrderStatus, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Некорректные параметры пагинации');
    }

    return await this.ordersRepository.getOrdersByStatus(status, page, limit);
  }

  async getOrdersStatistics(): Promise<OrderStatistics> {
    return await this.ordersRepository.getOrdersStatistics();
  }

  async searchOrders(query: string, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Поисковый запрос должен содержать минимум 2 символа');
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Некорректные параметры пагинации');
    }

    return await this.ordersRepository.searchOrders(query.trim(), page, limit);
  }

  private validateCreateOrderDto(createOrderDto: CreateOrderDto): void {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException(ORDERS_CONSTANTS.ERRORS.EMPTY_ORDER);
    }

    if (createOrderDto.items.length > ORDERS_CONSTANTS.VALIDATION.MAX_ITEMS) {
      throw new BadRequestException(ORDERS_CONSTANTS.ERRORS.TOO_MANY_ITEMS);
    }

    // Проверяем каждый товар
    createOrderDto.items.forEach((item, index) => {
      if (!item.productId || item.productId <= 0) {
        throw new BadRequestException(`${ORDERS_CONSTANTS.ERRORS.INVALID_ITEM_DATA} в позиции ${index + 1}`);
      }

      if (!item.quantity || item.quantity <= 0 || item.quantity > ORDERS_CONSTANTS.VALIDATION.MAX_QUANTITY) {
        throw new BadRequestException(`Некорректное количество товара в позиции ${index + 1}`);
      }

      if (!item.price || item.price <= 0) {
        throw new BadRequestException(`Некорректная цена товара в позиции ${index + 1}`);
      }
    });

    // Проверяем уникальность товаров
    const productIds = createOrderDto.items.map(item => item.productId);
    const uniqueProductIds = new Set(productIds);
    if (productIds.length !== uniqueProductIds.size) {
      throw new BadRequestException(ORDERS_CONSTANTS.ERRORS.DUPLICATE_ITEMS);
    }
  }

  private validateUpdateOrderDto(updateOrderDto: UpdateOrderDto): void {
    if (updateOrderDto.phone && !this.isValidPhone(updateOrderDto.phone)) {
      throw new BadRequestException('Некорректный номер телефона');
    }

    if (updateOrderDto.address && updateOrderDto.address.length > 500) {
      throw new BadRequestException('Адрес слишком длинный');
    }

    if (updateOrderDto.comment && updateOrderDto.comment.length > 1000) {
      throw new BadRequestException('Комментарий слишком длинный');
    }
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: []
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Нельзя изменить статус с "${currentStatus}" на "${newStatus}"`);
    }
  }

  private calculateOrderTotals(items: OrderItem[]): { totalPrice: number; totalCount: number } {
    let totalPrice = 0;
    let totalCount = 0;

    items.forEach(item => {
      totalPrice += item.price * item.quantity;
      totalCount += item.quantity;
    });

    return { totalPrice, totalCount };
  }

  private haveItemsChanged(currentItems: OrderItem[], newItems: OrderItem[]): boolean {
    // Если количество товаров разное, значит товары изменились
    if (currentItems.length !== newItems.length) {
      return true;
    }

    // Создаем мапы для быстрого сравнения
    const currentItemsMap = new Map();
    const newItemsMap = new Map();

    // Заполняем мапы текущими товарами
    currentItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}-${item.price}`;
      currentItemsMap.set(key, (currentItemsMap.get(key) || 0) + 1);
    });

    // Заполняем мапы новыми товарами
    newItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}-${item.price}`;
      newItemsMap.set(key, (newItemsMap.get(key) || 0) + 1);
    });

    // Сравниваем мапы
    if (currentItemsMap.size !== newItemsMap.size) {
      return true;
    }

    for (const [key, count] of currentItemsMap) {
      if (newItemsMap.get(key) !== count) {
        return true;
      }
    }

    return false;
  }

  private isValidPhone(phone: string): boolean {
    // Простая валидация номера телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
    return phoneRegex.test(phone);
  }
}
