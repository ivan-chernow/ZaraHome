import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThan, MoreThan } from 'typeorm';
import { Promocode } from './entity/promocode.entity';
import { PromocodeUsage } from './entity/promocode-usage.entity';

interface PromocodeUsageData {
  promocodeId: number;
  userId: number;
  orderAmount: number;
  discountApplied: number;
  usedAt: Date;
}

interface PromocodeListResponse {
  promocodes: Promocode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectRepository(Promocode)
    private promocodeRepository: Repository<Promocode>,
    @InjectRepository(PromocodeUsage)
    private promocodeUsageRepository: Repository<PromocodeUsage>,
  ) {}

  async findByCode(code: string): Promise<Promocode | null> {
    return this.promocodeRepository.findOne({
      where: { code: code.toUpperCase() }
    });
  }

  async findActiveByCode(code: string): Promise<Promocode | null> {
    return this.promocodeRepository.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true 
      }
    });
  }

  async findAllActive(): Promise<Promocode[]> {
    return this.promocodeRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findAllActivePaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<PromocodeListResponse> {
    const queryBuilder = this.promocodeRepository.createQueryBuilder('promocode')
      .where('promocode.isActive = :isActive', { isActive: true })
      .orderBy('promocode.createdAt', 'DESC');

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const promocodes = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      promocodes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  async findAll(): Promise<Promocode[]> {
    return this.promocodeRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<PromocodeListResponse> {
    const queryBuilder = this.promocodeRepository.createQueryBuilder('promocode')
      .orderBy('promocode.createdAt', 'DESC');

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const promocodes = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      promocodes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  async searchPromocodes(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PromocodeListResponse> {
    const queryBuilder = this.promocodeRepository.createQueryBuilder('promocode')
      .where(
        '(promocode.code ILIKE :query OR promocode.description ILIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('promocode.createdAt', 'DESC');

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const promocodes = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      promocodes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  async createPromocode(promocodeData: Partial<Promocode>): Promise<Promocode> {
    const promocode = this.promocodeRepository.create(promocodeData);
    return this.promocodeRepository.save(promocode);
  }

  async updatePromocode(code: string, updates: Partial<Promocode>): Promise<Promocode> {
    await this.promocodeRepository.update({ code: code.toUpperCase() }, updates);
    return this.findByCode(code) as Promise<Promocode>;
  }

  async deactivateByCode(code: string): Promise<void> {
    await this.promocodeRepository.update(
      { code: code.toUpperCase() },
      { isActive: false }
    );
  }

  async deleteByCode(code: string): Promise<void> {
    await this.promocodeRepository.delete({ code: code.toUpperCase() });
  }

  async incrementUsage(promocodeId: number): Promise<void> {
    await this.promocodeRepository.increment(
      { id: promocodeId },
      'currentUsage',
      1
    );
  }

  async recordUsage(usageData: PromocodeUsageData): Promise<PromocodeUsage> {
    const usage = this.promocodeUsageRepository.create(usageData);
    return this.promocodeUsageRepository.save(usage);
  }

  async getPromocodeStats(): Promise<{
    totalPromocodes: number;
    activePromocodes: number;
    totalUsage: number;
    totalDiscountApplied: number;
    averageDiscount: number;
  }> {
    const [totalPromocodes, activePromocodes, totalUsage, totalDiscountApplied] = await Promise.all([
      this.promocodeRepository.count(),
      this.promocodeRepository.count({ where: { isActive: true } }),
      this.promocodeUsageRepository.count(),
      this.promocodeUsageRepository
        .createQueryBuilder('usage')
        .select('SUM(usage.discountApplied)', 'total')
        .getRawOne()
        .then(result => parseFloat(result.total) || 0)
    ]);

    const averageDiscount = totalUsage > 0 ? totalDiscountApplied / totalUsage : 0;

    return {
      totalPromocodes,
      activePromocodes,
      totalUsage,
      totalDiscountApplied,
      averageDiscount
    };
  }

  async getPromocodeUsageStats(promocodeId: number): Promise<{
    totalUsage: number;
    totalDiscountApplied: number;
    averageOrderAmount: number;
    usageByDate: Array<{ date: string; usage: number; discount: number }>;
  }> {
    const [totalUsage, totalDiscountApplied, averageOrderAmount, usageByDate] = await Promise.all([
      this.promocodeUsageRepository.count({ where: { promocodeId } }),
      this.promocodeUsageRepository
        .createQueryBuilder('usage')
        .select('SUM(usage.discountApplied)', 'total')
        .where('usage.promocodeId = :promocodeId', { promocodeId })
        .getRawOne()
        .then(result => parseFloat(result.total) || 0),
      this.promocodeUsageRepository
        .createQueryBuilder('usage')
        .select('AVG(usage.orderAmount)', 'average')
        .where('usage.promocodeId = :promocodeId', { promocodeId })
        .getRawOne()
        .then(result => parseFloat(result.average) || 0),
      this.promocodeUsageRepository
        .createQueryBuilder('usage')
        .select('DATE(usage.usedAt)', 'date')
        .addSelect('COUNT(*)', 'usage')
        .addSelect('SUM(usage.discountApplied)', 'discount')
        .where('usage.promocodeId = :promocodeId', { promocodeId })
        .groupBy('DATE(usage.usedAt)')
        .orderBy('date', 'DESC')
        .limit(30)
        .getRawMany()
        .then(results => results.map(r => ({
          date: r.date,
          usage: parseInt(r.usage),
          discount: parseFloat(r.discount)
        })))
    ]);

    return {
      totalUsage,
      totalDiscountApplied,
      averageOrderAmount,
      usageByDate
    };
  }

  async findExpiredPromocodes(): Promise<Promocode[]> {
    return this.promocodeRepository.find({
      where: {
        expiresAt: LessThan(new Date()),
        isActive: true
      }
    });
  }

  async findPromocodesByUsageLimit(): Promise<Promocode[]> {
    return this.promocodeRepository
      .createQueryBuilder('promocode')
      .where('promocode.isActive = :isActive', { isActive: true })
      .andWhere('promocode.maxUsage IS NOT NULL')
      .andWhere('promocode.currentUsage >= promocode.maxUsage')
      .getMany();
  }

  async getPromocodesByDiscountRange(
    minDiscount: number,
    maxDiscount: number,
    page: number = 1,
    limit: number = 20
  ): Promise<PromocodeListResponse> {
    const queryBuilder = this.promocodeRepository.createQueryBuilder('promocode')
      .where('promocode.discount BETWEEN :minDiscount AND :maxDiscount', { minDiscount, maxDiscount })
      .andWhere('promocode.isActive = :isActive', { isActive: true })
      .orderBy('promocode.createdAt', 'DESC');

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const promocodes = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      promocodes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  async getPromocodesByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 20
  ): Promise<PromocodeListResponse> {
    const queryBuilder = this.promocodeRepository.createQueryBuilder('promocode')
      .where('promocode.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('promocode.createdAt', 'DESC');

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const promocodes = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      promocodes,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }
}
