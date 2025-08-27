import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from 'src/common/base/base.exceptions';
import { Order } from './entity/order.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { IOrderService } from 'src/common/interfaces/service.interface';
import { OrderItem } from 'src/common/interfaces/order-item.interface';

@Injectable()
export class OrdersService implements IOrderService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
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

    // Создаем новый заказ
    const order = await this.ordersRepository.createOrder({
      ...createOrderDto,
      user,
      status: OrderStatus.PENDING,
    });

    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.ordersRepository.findOrdersByUser(userId);
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
      const key = `${item.productId}-${item.quantity}`;
      currentItemsMap.set(key, (currentItemsMap.get(key) || 0) + 1);
    });

    // Заполняем мапы новыми товарами
    newItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}`;
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
}
