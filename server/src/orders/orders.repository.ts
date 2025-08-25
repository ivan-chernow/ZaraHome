import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { User } from '../users/user/entity/user.entity';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async findActiveOrderByUser(userId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { 
        user: { id: userId },
        status: OrderStatus.PENDING
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOrderByIdAndUser(orderId: number, userId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async updateOrder(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    await this.orderRepository.update(orderId, { status });
  }
}
