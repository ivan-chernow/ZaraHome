import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/user/entity/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    // Проверяем, есть ли уже активный заказ у пользователя
    const existingActiveOrder = await this.orderRepository.findOne({
      where: { 
        user: { id: user.id },
        status: OrderStatus.PENDING
      },
      order: { createdAt: 'DESC' }
    });

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
      await this.orderRepository.save(existingActiveOrder);
    }

    // Создаем новый заказ
    const order = this.orderRepository.create({
      ...createOrderDto,
      user,
      status: OrderStatus.PENDING,
    });

    return await this.orderRepository.save(order);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveOrder(userId: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { 
        user: { id: userId },
        status: OrderStatus.PENDING
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderById(orderId: number, userId: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    return await this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED, userId);
  }

  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);
    if (!order) {
      throw new Error('Order not found');
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

    return await this.orderRepository.save(order);
  }

  private haveItemsChanged(currentItems: any[], newItems: any[]): boolean {
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
