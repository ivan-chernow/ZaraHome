import { Injectable } from '@nestjs/common';
import { InternalServerException } from 'src/shared/shared.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entity/user.entity';
import { DeliveryAddress } from './entity/delivery-address.entity';
import { CacheService } from 'src/shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from 'src/shared/cache/cache.constants';
import { UserSearchFilters, UserStatistics, PaginatedResponse } from '../users.interfaces';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DeliveryAddress)
    private addressRepository: Repository<DeliveryAddress>,
    private cacheService: CacheService,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'isEmailVerified'],
      relations: ['deliveryAddresses']
    });
  }

  async findUserByIdWithPassword(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password', 'updatedAt']
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'updatedAt']
    });
  }

  async findUserByIdWithAddresses(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['deliveryAddresses']
    });
  }

  async findUserByIdBasic(userId: number): Promise<User | null> {
    const cacheKey = `user:${userId}:basic`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.userRepository.findOne({
      where: { id: userId }
      }),
      { ttl: CACHE_TTL.USER_PROFILE, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findAllUsers(filters?: UserSearchFilters): Promise<PaginatedResponse<User>> {
    const cacheKey = `users:${JSON.stringify(filters)}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getUsersWithFilters(filters),
      { ttl: CACHE_TTL.SEARCH_RESULTS, prefix: CACHE_PREFIXES.USER }
    );
  }

  async searchUsers(filters: UserSearchFilters): Promise<PaginatedResponse<User>> {
    const cacheKey = `users_search:${JSON.stringify(filters)}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getUsersWithFilters(filters),
      { ttl: CACHE_TTL.SEARCH_RESULTS, prefix: CACHE_PREFIXES.USER }
    );
  }

  async getUserStatistics(): Promise<UserStatistics> {
    const cacheKey = 'users_statistics';
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.calculateUserStatistics(),
      { ttl: CACHE_TTL.USER_STATS, prefix: CACHE_PREFIXES.STATS }
    );
  }

  async findUsersByRole(role: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    const cacheKey = `users_by_role:${role}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getUsersByRolePaginated(role, page, limit),
      { ttl: CACHE_TTL.SEARCH_RESULTS, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findUsersByStatus(status: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    const cacheKey = `users_by_status:${status}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getUsersByStatusPaginated(status, page, limit),
      { ttl: CACHE_TTL.SEARCH_RESULTS, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findUsersByEmailVerification(isVerified: boolean, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    const cacheKey = `users_by_verification:${isVerified}:${page}:${limit}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.getUsersByEmailVerificationPaginated(isVerified, page, limit),
      { ttl: CACHE_TTL.SEARCH_RESULTS, prefix: CACHE_PREFIXES.USER }
    );
  }

  // Приватные методы для реализации пагинации и фильтрации
  private async getUsersWithFilters(filters?: UserSearchFilters): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (filters?.query) {
      queryBuilder.where(
        '(user.email ILIKE :query OR user.firstName ILIKE :query OR user.lastName ILIKE :query)',
        { query: `%${filters.query}%` }
      );
    }
    
    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }
    
    if (filters?.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }
    
    if (filters?.isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified: filters.isEmailVerified });
    }
    
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'DESC';
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;
    
    const total = await queryBuilder.getCount();
    const users = await queryBuilder.skip(offset).take(limit).getMany();
    
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async getUsersByRolePaginated(role: string, page: number, limit: number): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role })
      .orderBy('user.createdAt', 'DESC');
    
    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const users = await queryBuilder.skip(offset).take(limit).getMany();
    
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async getUsersByStatusPaginated(status: string, page: number, limit: number): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.status = :status', { status })
      .orderBy('user.createdAt', 'DESC');
    
    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const users = await queryBuilder.skip(offset).take(limit).getMany();
    
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async getUsersByEmailVerificationPaginated(isVerified: boolean, page: number, limit: number): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.isEmailVerified = :isVerified', { isVerified })
      .orderBy('user.createdAt', 'DESC');
    
    const total = await queryBuilder.getCount();
    const offset = (page - 1) * limit;
    
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    const users = await queryBuilder.skip(offset).take(limit).getMany();
    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  private async calculateUserStatistics(): Promise<UserStatistics> {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      pendingVerificationUsers,
      verifiedUsers,
      unverifiedUsers,
      usersByRole,
      usersByStatus,
      newUsersThisMonth,
      newUsersThisWeek
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: 'active' } }),
      this.userRepository.count({ where: { status: 'inactive' } }),
      this.userRepository.count({ where: { status: 'suspended' } }),
      this.userRepository.count({ where: { status: 'pending_verification' } }),
      this.userRepository.count({ where: { isEmailVerified: true } }),
      this.userRepository.count({ where: { isEmailVerified: false } }),
      this.getUsersByRoleCount(),
      this.getUsersByStatusCount(),
      this.getNewUsersCount('month'),
      this.getNewUsersCount('week')
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      pendingVerificationUsers,
      verifiedUsers,
      unverifiedUsers,
      usersByRole,
      usersByStatus,
      newUsersThisMonth,
      newUsersThisWeek
    };
  }

  private async getUsersByRoleCount(): Promise<Record<string, number>> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.role] = parseInt(item.count);
      return acc;
    }, {} as Record<string, number>);
  }

  private async getUsersByStatusCount(): Promise<Record<string, number>> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {} as Record<string, number>);
  }

  private async getNewUsersCount(period: 'month' | 'week'): Promise<number> {
    const date = new Date();
    let startDate: Date;

    if (period === 'month') {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    } else {
      const weekStart = date.getDate() - date.getDay();
      startDate = new Date(date.setDate(weekStart));
    }

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startDate', { startDate })
      .getCount();
  }

  async findAddressById(addressId: number): Promise<DeliveryAddress | null> {
    const cacheKey = `address:${addressId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['user']
      }),
      { ttl: CACHE_TTL.USER_ADDRESSES, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findAddressesByUser(userId: number): Promise<DeliveryAddress[]> {
    const cacheKey = `user_addresses:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.addressRepository.find({
        where: { userId },
        order: { createdAt: 'ASC' }
      }),
      { ttl: CACHE_TTL.USER_ADDRESSES, prefix: CACHE_PREFIXES.USER }
    );
  }

  async findDefaultAddressByUser(userId: number): Promise<DeliveryAddress | null> {
    const cacheKey = `user_default_address:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.addressRepository.findOne({
        where: { userId }
      }),
      { ttl: CACHE_TTL.USER_ADDRESSES, prefix: CACHE_PREFIXES.USER }
    );
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword
    });
    await this.invalidateUserCache(userId);
  }

  async updateUserEmail(userId: number, newEmail: string): Promise<void> {
    await this.userRepository.update(userId, {
      email: newEmail,
      isEmailVerified: true
    });
    await this.invalidateUserCache(userId);
  }

  async updateAddress(addressId: number, addressData: any): Promise<void> {
    await this.addressRepository.update(addressId, addressData);
    // Получаем userId для инвалидации кеша
    const address = await this.addressRepository.findOne({ where: { id: addressId } });
    if (address) {
      await this.invalidateAddressCache(address.userId);
    }
  }

  async createAddress(addressData: any): Promise<DeliveryAddress> {
    const result = await this.addressRepository.insert(addressData);
    const id = result.identifiers[0].id;
    const savedAddress = await this.addressRepository.findOne({ where: { id } });
    if (!savedAddress) {
      // Непредвиденная ситуация при вставке адреса
      throw new InternalServerException('Не удалось создать адрес доставки');
    }
    await this.invalidateAddressCache(addressData.userId);
    return savedAddress;
  }

  async removeAddress(address: DeliveryAddress): Promise<void> {
    await this.addressRepository.remove(address);
    await this.invalidateAddressCache(address.userId);
  }

  // Методы для инвалидации кеша
  private async invalidateUserCache(userId: number): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.USER}:user:${userId}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.USER}:users`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.STATS}:users_statistics`)
    ]);
  }

  private async invalidateAddressCache(userId: number): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.USER}:user_addresses:${userId}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.USER}:user_default_address:${userId}`),
      this.cacheService.deleteByPrefix(`${CACHE_PREFIXES.USER}:address`)
    ]);
  }
}
