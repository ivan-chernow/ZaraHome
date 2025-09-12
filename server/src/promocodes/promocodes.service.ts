import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Promocode } from './entity/promocode.entity';
import { PromocodesRepository } from './promocodes.repository';
import { IPromocodeService } from 'src/shared/shared.interfaces';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';
import { PROMOCODES_CONSTANTS } from './promocodes.constants';

// Removed unused PromocodeUsage interface

export interface PromocodeStats {
  totalPromocodes: number;
  activePromocodes: number;
  totalUsage: number;
  totalDiscountApplied: number;
  averageDiscount: number;
}

@Injectable()
export class PromocodesService implements IPromocodeService {
  private readonly promocodesRepository: PromocodesRepository;
  private readonly cacheService: CacheService;

  constructor(
    promocodesRepository: PromocodesRepository,
    cacheService: CacheService
  ) {
    this.promocodesRepository = promocodesRepository;
    this.cacheService = cacheService;
  }

  // Создание промокода (для админа)
  async create(
    code: string,
    discount: number,
    options?: {
      maxUsage?: number;
      minOrderAmount?: number;
      expiresAt?: Date;
      description?: string;
    }
  ): Promise<Promocode> {
    // Валидация входных данных
    this.validatePromocodeData(code, discount, options);

    // Проверяем, не существует ли уже такой промокод
    const existingPromocode = await this.promocodesRepository.findByCode(code);

    if (existingPromocode) {
      throw new ConflictException(
        PROMOCODES_CONSTANTS.ERRORS.CODE_ALREADY_EXISTS
      );
    }

    const promocode = await this.promocodesRepository.createPromocode({
      code: code.toUpperCase(),
      discount,
      isActive: true,
      maxUsage: options?.maxUsage || null,
      currentUsage: 0,
      minOrderAmount: options?.minOrderAmount || 0,
      expiresAt: options?.expiresAt || null,
      description: options?.description || null,
    });

    // Инвалидируем кеш промокодов
    await this.invalidatePromocodesCache();

    return promocode;
  }

  // Проверка и применение промокода
  async validateAndApply(
    code: string,
    orderAmount: number,
    _userId?: number
  ): Promise<{
    isValid: boolean;
    message?: string;
    discount?: number;
    finalAmount?: number;
    promocode?: Promocode;
  }> {
    // Валидация входных данных
    if (!code || code.trim().length === 0) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.INVALID_CODE,
      };
    }

    if (orderAmount <= 0) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.INVALID_ORDER_AMOUNT,
      };
    }

    const promocode = await this.promocodesRepository.findActiveByCode(code);

    if (!promocode) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.PROMOCODE_NOT_FOUND,
      };
    }

    // Проверяем срок действия
    if (promocode.expiresAt && promocode.expiresAt < new Date()) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.PROMOCODE_EXPIRED,
      };
    }

    // Проверяем минимальную сумму заказа
    if (promocode.minOrderAmount && orderAmount < promocode.minOrderAmount) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.MIN_ORDER_AMOUNT(
          promocode.minOrderAmount
        ),
      };
    }

    // Проверяем лимит использования
    if (promocode.maxUsage && promocode.currentUsage >= promocode.maxUsage) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.USAGE_LIMIT_EXCEEDED,
      };
    }

    // Проверяем, что скидка не больше 100%
    if (promocode.discount > 100) {
      return {
        isValid: false,
        message: PROMOCODES_CONSTANTS.ERRORS.INVALID_DISCOUNT,
      };
    }

    const discount = (orderAmount * promocode.discount) / 100;
    const finalAmount = orderAmount - discount;

    return {
      isValid: true,
      discount,
      finalAmount,
      promocode,
    };
  }

  // Получение всех активных промокодов с пагинацией
  async getAllActive(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    promocodes: Promocode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const cacheKey = `active_promocodes:${page}:${limit}`;

    return this.cacheService.getOrSet(
      cacheKey,
      () => this.promocodesRepository.findAllActivePaginated(page, limit),
      {
        ttl: CACHE_TTL.PROMOCODES,
        prefix: CACHE_PREFIXES.PROMOCODES,
      }
    );
  }

  // Получение всех промокодов (активных и неактивных) с пагинацией
  async getAll(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    promocodes: Promocode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.promocodesRepository.findAllPaginated(page, limit);
  }

  // Поиск промокодов
  async searchPromocodes(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    promocodes: Promocode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (
      !query ||
      query.trim().length < PROMOCODES_CONSTANTS.MIN_SEARCH_LENGTH
    ) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.SEARCH_TOO_SHORT
      );
    }

    const cacheKey = `search_promocodes:${query}:${page}:${limit}`;

    return this.cacheService.getOrSet(
      cacheKey,
      () => this.promocodesRepository.searchPromocodes(query, page, limit),
      {
        ttl: CACHE_TTL.SEARCH,
        prefix: CACHE_PREFIXES.SEARCH,
      }
    );
  }

  // Деактивация промокода (для админа)
  async deactivate(code: string): Promise<void> {
    const promocode = await this.promocodesRepository.findByCode(code);

    if (!promocode) {
      throw new NotFoundException(
        PROMOCODES_CONSTANTS.ERRORS.PROMOCODE_NOT_FOUND
      );
    }

    await this.promocodesRepository.deactivateByCode(code);

    // Инвалидируем кеш промокодов
    await this.invalidatePromocodesCache();
  }

  // Массовая деактивация промокодов
  async deactivateMultiple(
    codes: string[]
  ): Promise<{ deactivated: number; failed: number }> {
    if (!codes.length) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.NO_CODES_PROVIDED
      );
    }

    if (codes.length > PROMOCODES_CONSTANTS.MAX_BATCH_SIZE) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.BATCH_SIZE_EXCEEDED
      );
    }

    const results = await Promise.allSettled(
      codes.map(code => this.deactivate(code))
    );

    const deactivated = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Инвалидируем кеш после массовой деактивации
    await this.invalidatePromocodesCache();

    return { deactivated, failed };
  }

  // Получение статистики промокодов
  async getPromocodeStats(): Promise<PromocodeStats> {
    return this.cacheService.getOrSet(
      'promocodes_stats',
      () => this.promocodesRepository.getPromocodeStats(),
      {
        ttl: CACHE_TTL.STATS,
        prefix: CACHE_PREFIXES.STATS,
      }
    );
  }

  // Обновление промокода
  async update(
    code: string,
    updates: Partial<{
      discount: number;
      maxUsage: number;
      minOrderAmount: number;
      expiresAt: Date;
      description: string;
      isActive: boolean;
    }>
  ): Promise<Promocode> {
    const promocode = await this.promocodesRepository.findByCode(code);

    if (!promocode) {
      throw new NotFoundException(
        PROMOCODES_CONSTANTS.ERRORS.PROMOCODE_NOT_FOUND
      );
    }

    // Валидация обновляемых данных
    if (updates.discount !== undefined) {
      this.validateDiscount(updates.discount);
    }

    if (updates.maxUsage !== undefined) {
      this.validateMaxUsage(updates.maxUsage, promocode.currentUsage);
    }

    const updatedPromocode = await this.promocodesRepository.updatePromocode(
      code,
      updates
    );

    // Инвалидируем кеш промокодов
    await this.invalidatePromocodesCache();

    return updatedPromocode;
  }

  // Валидация данных промокода
  private validatePromocodeData(
    code: string,
    discount: number,
    options?: any
  ): void {
    if (!code || code.trim().length < PROMOCODES_CONSTANTS.MIN_CODE_LENGTH) {
      throw new BadRequestException(PROMOCODES_CONSTANTS.ERRORS.INVALID_CODE);
    }

    if (code.length > PROMOCODES_CONSTANTS.MAX_CODE_LENGTH) {
      throw new BadRequestException(PROMOCODES_CONSTANTS.ERRORS.CODE_TOO_LONG);
    }

    this.validateDiscount(discount);

    if (options?.maxUsage !== undefined) {
      this.validateMaxUsage(options.maxUsage);
    }

    if (options?.minOrderAmount !== undefined) {
      if (options.minOrderAmount < 0) {
        throw new BadRequestException(
          PROMOCODES_CONSTANTS.ERRORS.INVALID_MIN_ORDER_AMOUNT
        );
      }
    }

    if (options?.expiresAt !== undefined) {
      if (options.expiresAt <= new Date()) {
        throw new BadRequestException(
          PROMOCODES_CONSTANTS.ERRORS.INVALID_EXPIRY_DATE
        );
      }
    }
  }

  // Валидация скидки
  private validateDiscount(discount: number): void {
    if (discount <= 0 || discount > 100) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.INVALID_DISCOUNT
      );
    }
  }

  // Валидация максимального использования
  private validateMaxUsage(maxUsage: number, currentUsage: number = 0): void {
    if (maxUsage <= 0) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.INVALID_MAX_USAGE
      );
    }

    if (currentUsage > maxUsage) {
      throw new BadRequestException(
        PROMOCODES_CONSTANTS.ERRORS.CURRENT_USAGE_EXCEEDS_MAX
      );
    }
  }

  /**
   * Инвалидировать кеш промокодов
   */
  private async invalidatePromocodesCache(): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.PROMOCODES),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.SEARCH),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.STATS),
    ]);
  }
}
