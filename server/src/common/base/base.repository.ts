import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder, FindOptionsWhere, FindOptionsOrder, FindManyOptions, ObjectLiteral, In } from 'typeorm';
import { IBaseService } from '../interfaces';

/**
 * Базовый абстрактный класс для всех репозиториев
 * Предоставляет общие методы CRUD операций и базовую функциональность
 */
@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>
  ) {}

  protected createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  /**
   * Найти элементы с отношениями
   */
  async findWithRelations(
    options: FindManyOptions<T> = {},
    relations: string[] = []
  ): Promise<T[]> {
    return await this.repository.find({
      ...options,
      relations,
    });
  }

  /**
   * Найти один элемент с отношениями
   */
  async findOneWithRelations(
    options: FindManyOptions<T> = {},
    relations: string[] = []
  ): Promise<T | null> {
    return await this.repository.findOne({
      ...options,
      relations,
    });
  }

  /**
   * Найти элементы по ID с отношениями
   */
  async findByIdsWithRelations(
    ids: number[],
    relations: string[] = []
  ): Promise<T[]> {
    if (!ids.length) return [];
    return await this.repository.find({
      where: { id: In(ids) } as any,
      relations
    });
  }

  /**
   * Найти элементы по условию с сортировкой
   */
  async findByConditionWithSort(
    condition: FindOptionsWhere<T>,
    sortOptions: FindOptionsOrder<T> = {},
    relations: string[] = []
  ): Promise<T[]> {
    return await this.repository.find({
      where: condition,
      order: sortOptions,
      relations,
    });
  }

  /**
   * Найти элементы с пагинацией и сортировкой
   */
  async findWithPaginationAndSort(
    page: number = 1,
    limit: number = 10,
    sortOptions: FindOptionsOrder<T> = {},
    relations: string[] = [],
    where?: FindOptionsWhere<T>
  ): Promise<{ data: T[]; total: number; page: number; limit: number; pages: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.repository.findAndCount({
      where,
      order: sortOptions,
      relations,
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Найти элементы по текстовому поиску
   */
  async findByTextSearch(
    searchTerm: string,
    searchFields: string[],
    options: FindManyOptions<T> = {}
  ): Promise<T[]> {
    const queryBuilder = this.createQueryBuilder('entity');
    
    searchFields.forEach((field, index) => {
      if (index === 0) {
        queryBuilder.where(`entity.${field} ILIKE :searchTerm`, { searchTerm: `%${searchTerm}%` });
      } else {
        queryBuilder.orWhere(`entity.${field} ILIKE :searchTerm`, { searchTerm: `%${searchTerm}%` });
      }
    });

    return await queryBuilder.getMany();
  }

  /**
   * Найти элементы по диапазону дат
   */
  async findByDateRange(
    dateField: string,
    startDate: Date,
    endDate: Date,
    options: FindManyOptions<T> = {}
  ): Promise<T[]> {
    const queryBuilder = this.createQueryBuilder('entity');
    
    queryBuilder
      .where(`entity.${dateField} >= :startDate`, { startDate })
      .andWhere(`entity.${dateField} <= :endDate`, { endDate });

    return await queryBuilder.getMany();
  }

  /**
   * Найти элементы по числовому диапазону
   */
  async findByNumberRange(
    field: string,
    min: number,
    max: number,
    options: FindManyOptions<T> = {}
  ): Promise<T[]> {
    const queryBuilder = this.createQueryBuilder('entity');
    
    queryBuilder
      .where(`entity.${field} >= :min`, { min })
      .andWhere(`entity.${field} <= :max`, { max });

    return await queryBuilder.getMany();
  }

  /**
   * Получить агрегированные данные
   */
  async getAggregatedData(
    field: string,
    aggregation: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' = 'COUNT',
    where?: FindOptionsWhere<T>
  ): Promise<number> {
    const queryBuilder = this.createQueryBuilder('entity');
    
    queryBuilder.select(`${aggregation}(entity.${field})`, 'result');
    
    if (where) {
      Object.keys(where).forEach(key => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: where[key] });
      });
    }

    const result = await queryBuilder.getRawOne();
    return result?.result || 0;
  }

  /**
   * Получить уникальные значения поля
   */
  async getDistinctValues(field: string): Promise<any[]> {
    const queryBuilder = this.createQueryBuilder('entity');
    queryBuilder.select(`DISTINCT entity.${field}`, field);
    return await queryBuilder.getRawMany();
  }

  /**
   * Получить элементы с группировкой
   */
  async getGroupedData(
    groupBy: string,
    selectFields: string[] = [],
    where?: FindOptionsWhere<T>
  ): Promise<any[]> {
    const queryBuilder = this.createQueryBuilder('entity');
    
    queryBuilder
      .select(`entity.${groupBy}`, 'group')
      .addSelect('COUNT(*)', 'count');
    
    selectFields.forEach(field => {
      queryBuilder.addSelect(`entity.${field}`, field);
    });
    
    queryBuilder.groupBy(`entity.${groupBy}`);
    
    if (where) {
      Object.keys(where).forEach(key => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: where[key] });
      });
    }

    return await queryBuilder.getRawMany();
  }

  /**
   * Проверить существование элемента по условию
   */
  async existsByCondition(condition: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where: condition });
    return count > 0;
  }

  /**
   * Получить количество элементов по условию
   */
  async countByCondition(condition: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count({ where: condition });
  }

  /**
   * Обновить элементы по условию
   */
  async update(condition: FindOptionsWhere<T>, updateData: Partial<T>): Promise<T | null> {
    const result = await this.repository.update(condition, updateData as any);
    if (result.affected === 0) return null;
    
    // Возвращаем обновленную сущность
    const whereKeys = Object.keys(condition);
    if (whereKeys.length > 0) {
      const firstKey = whereKeys[0];
      const firstValue = (condition as any)[firstKey];
      return await this.repository.findOne({ where: { [firstKey]: firstValue } as any });
    }
    
    return null;
  }

  /**
   * Удалить элементы по условию
   */
  async deleteByCondition(condition: FindOptionsWhere<T>): Promise<number> {
    const result = await this.repository.delete(condition);
    return result.affected || 0;
  }

  /**
   * Транзакционное выполнение операций
   */
  async executeInTransaction<R>(
    operation: (queryRunner: any) => Promise<R>
  ): Promise<R> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByIds(
    ids: number[],
    relations: string[] = []
  ): Promise<T[]> {
    if (!ids.length) return [];
    return await this.repository.find({
      where: { id: In(ids) } as any,
      relations
    });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    where: FindOptionsWhere<T> = {},
    relations: string[] = [],
    sortOptions: FindOptionsOrder<T> = {}
  ): Promise<{ items: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [items, total] = await this.repository.findAndCount({
      where,
      relations,
      skip,
      take: limit,
      order: sortOptions,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findAllWithSort(
    where: FindOptionsWhere<T> = {},
    relations: string[] = [],
    sortOptions: FindOptionsOrder<T> = {}
  ): Promise<T[]> {
    return await this.repository.find({
      where,
      relations,
      order: sortOptions,
    });
  }
}
