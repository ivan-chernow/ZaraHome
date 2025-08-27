import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Promocode } from './entity/promocode.entity';
import { PromocodesRepository } from './promocodes.repository';
import { IPromocodeService } from 'src/common/interfaces/service.interface';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES, CACHE_KEYS } from '../shared/cache/cache.constants';

@Injectable()
export class PromocodesService implements IPromocodeService {
  constructor(
    private readonly promocodesRepository: PromocodesRepository,
    private readonly cacheService: CacheService,
  ) {}

  // Создание промокода (для админа)
  async create(code: string, discount: number): Promise<Promocode> {
    // Проверяем, не существует ли уже такой промокод
    const existingPromocode = await this.promocodesRepository.findByCode(code);

    if (existingPromocode) {
      throw new ConflictException('Промокод с таким кодом уже существует');
    }

    const promocode = await this.promocodesRepository.createPromocode({
      code: code.toUpperCase(),
      discount,
      isActive: true
    });
    
    // Инвалидируем кеш промокодов
    await this.invalidatePromocodesCache();
    
    return promocode;
  }

  // Проверка и применение промокода
  async validateAndApply(code: string, orderAmount: number): Promise<{ 
    isValid: boolean; 
    message?: string; 
    discount?: number;
    finalAmount?: number;
  }> {
    const promocode = await this.promocodesRepository.findActiveByCode(code);

    if (!promocode) {
      return { isValid: false, message: 'Промокод не найден или недействителен' };
    }

    // Проверяем, что сумма заказа больше 0
    if (orderAmount <= 0) {
      return { isValid: false, message: 'Сумма заказа должна быть больше 0' };
    }

    // Проверяем, что скидка не больше 100%
    if (promocode.discount > 100) {
      return { isValid: false, message: 'Некорректный размер скидки' };
    }

    const discount = (orderAmount * promocode.discount) / 100;
    const finalAmount = orderAmount - discount;

    return { 
      isValid: true, 
      discount,
      finalAmount
    };
  }

  // Получение всех активных промокодов
  async getAllActive(): Promise<Promocode[]> {
    return this.cacheService.getOrSet(
      CACHE_KEYS.ACTIVE_PROMOCODES,
      () => this.promocodesRepository.findAllActive(),
      { 
        ttl: CACHE_TTL.PROMOCODES, 
        prefix: CACHE_PREFIXES.PROMOCODES 
      }
    );
  }

  // Получение всех промокодов (активных и неактивных)
  async getAll(): Promise<Promocode[]> {
    return await this.promocodesRepository.findAll();
  }

  // Деактивация/удаление промокода (для админа)
  async deactivate(code: string): Promise<void> {
    const promocode = await this.promocodesRepository.findByCode(code);

    if (!promocode) {
      throw new NotFoundException(`Промокод с кодом ${code} не найден`);
    }

    // Жёсткое удаление записи из БД по запросу "деактивировать"
    await this.promocodesRepository.deleteByCode(code);
    
    // Инвалидируем кеш промокодов
    await this.invalidatePromocodesCache();
  }

  /**
   * Инвалидировать кеш промокодов
   */
  private async invalidatePromocodesCache(): Promise<void> {
    await this.cacheService.deleteByPrefix(CACHE_PREFIXES.PROMOCODES);
  }
} 