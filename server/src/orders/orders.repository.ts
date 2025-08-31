import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './entity/order.entity';
import { User } from '../users/user/entity/user.entity';
import { OrderStatus } from '../shared/shared.interfaces';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    const cacheKey = `user:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.userRepository.findOneBy({ id: userId }),
      { ttl: CACHE_TTL.USER, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findActiveOrderByUser(userId: number): Promise<Order | null> {
    const cacheKey = `active_order:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.orderRepository.findOne({
        where: { 
          user: { id: userId },
          status: OrderStatus.PENDING
        },
        order: { createdAt: 'DESC' },
        relations: ['user']
      }),
      { ttl: CACHE_TTL.ORDERS, prefix: CACHE_PREFIXES.ORDERS }
    );
  }

  async findOrdersByUser(userId: number, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    const cacheKey = `user_orders:${userId}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getOrdersByUserPaginated(userId, page, limit),
      { ttl: CACHE_TTL.ORDERS, prefix: CACHE_PREFIXES.ORDERS }
    );
  }

  async findOrderByIdAndUser(orderId: number, userId: number): Promise<Order | null> {
    const cacheKey = `order:${orderId}:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.orderRepository.findOne({
        where: { id: orderId, user: { id: userId } },
        relations: ['user']
      }),
      { ttl: CACHE_TTL.ORDERS, prefix: CACHE_PREFIXES.ORDERS }
    );
  }

  async findOrderById(orderId: number): Promise<Order | null> {
    const cacheKey = `order:${orderId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user']
      }),
      { ttl: CACHE_TTL.ORDERS, prefix: CACHE_PREFIXES.ORDERS }
    );
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);
    
    // Инвалидируем кеш
    if (orderData.user?.id) {
      await this.invalidateUserOrdersCache(orderData.user.id);
    }
    
    return savedOrder;
  }

  async updateOrder(order: Order): Promise<Order> {
    const updatedOrder = await this.orderRepository.save(order);
    
    // Инвалидируем кеш
    await this.invalidateOrderCache(updatedOrder);
    
    return updatedOrder;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    await this.orderRepository.update(orderId, { status });
    
    // Инвалидируем кеш
    const order = await this.findOrderById(orderId);
    if (order) {
      await this.invalidateOrderCache(order);
    }
  }

  async getOrdersByStatus(status: OrderStatus, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    const cacheKey = `orders_by_status:${status}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getOrdersByStatusPaginated(status, page, limit),
      { ttl: CACHE_TTL.ORDERS, prefix: CACHE_PREFIXES.ORDERS }
    );
  }

  async getOrdersStatistics(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const cacheKey = 'orders_statistics';
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.calculateOrdersStatistics(),
      { ttl: CACHE_TTL.STATS, prefix: CACHE_PREFIXES.STATS }
    );
  }

  async searchOrders(query: string, page: number = 1, limit: number = 20): Promise<OrderListResponse> {
    const cacheKey = `search_orders:${query}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.searchOrdersPaginated(query, page, limit),
      { ttl: CACHE_TTL.SEARCH, prefix: CACHE_PREFIXES.SEARCH }
    );
  }

  private async getOrdersByUserPaginated(userId: number, page: number, limit: number): Promise<OrderListResponse> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('order.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const orders = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      orders,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async getOrdersByStatusPaginated(status: OrderStatus, page: number, limit: number): Promise<OrderListResponse> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.status = :status', { status })
      .orderBy('order.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const orders = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      orders,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async searchOrdersPaginated(query: string, page: number, limit: number): Promise<OrderListResponse> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where(
        '(order.id::text ILIKE :query OR user.email ILIKE :query OR order.phone ILIKE :query OR order.address ILIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('order.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const orders = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      orders,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async calculateOrdersStatistics(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const [totalOrders, pendingOrders, deliveredOrders, cancelledOrders, revenueResult] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.totalPrice)', 'total')
        .where('order.status = :status', { status: OrderStatus.DELIVERED })
        .getRawOne()
    ]);

    const totalRevenue = parseFloat(revenueResult?.total || '0');
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue
    };
  }

  private async invalidateOrderCache(order: Order): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:order:${order.id}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:user_orders:${order.user.id}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:active_order:${order.user.id}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:orders_by_status`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.STATS}:orders_statistics`)
    ]);
  }

  private async invalidateUserOrdersCache(userId: number): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:user_orders:${userId}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.ORDERS}:active_order:${userId}`)
    ]);
  }
}
