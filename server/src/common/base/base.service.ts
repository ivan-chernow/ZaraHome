import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';
import { IBaseService } from '../interfaces';

/**
 * Базовый абстрактный класс для всех сервисов
 * Предоставляет общие методы CRUD операций и базовую функциональность
 */
@Injectable()
export abstract class BaseService<T, CreateDto, UpdateDto> implements IBaseService<T> {
  
  constructor(
    protected readonly repository: Repository<T>
  ) {}

  /**
   * Создать новый элемент
   */
  async create(data: CreateDto): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      return await this.repository.save(entity);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new ConflictException('Элемент уже существует');
      }
      throw new BadRequestException('Ошибка при создании элемента');
    }
  }

  /**
   * Получить все элементы с пагинацией и фильтрацией
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new BadRequestException('Ошибка при получении элементов');
    }
  }

  /**
   * Получить элемент по ID
   */
  async findOne(id: number): Promise<T | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } as any });
      if (!entity) {
        throw new NotFoundException(`Элемент с ID ${id} не найден`);
      }
      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при получении элемента');
    }
  }

  /**
   * Обновить элемент по ID
   */
  async update(id: number, data: Partial<UpdateDto>): Promise<T> {
    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException(`Элемент с ID ${id} не найден`);
      }
      
      Object.assign(entity, data);
      return await this.repository.save(entity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при обновлении элемента');
    }
  }

  /**
   * Удалить элемент по ID
   */
  async delete(id: number): Promise<void> {
    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException(`Элемент с ID ${id} не найден`);
      }
      
      await this.repository.remove(entity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при удалении элемента');
    }
  }

  /**
   * Найти элементы по условию
   */
  async findByCondition(condition: FindOptionsWhere<T>): Promise<T[]> {
    try {
      return await this.repository.find({ where: condition });
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске элементов');
    }
  }

  /**
   * Найти один элемент по условию
   */
  async findOneByCondition(condition: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.repository.findOne(condition);
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске элемента');
    }
  }

  /**
   * Проверить существование элемента
   */
  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.repository.count({ where: { id } as any });
      return count > 0;
    } catch (error) {
      throw new BadRequestException('Ошибка при проверке существования элемента');
    }
  }

  /**
   * Получить количество элементов
   */
  async count(condition?: FindOptionsWhere<T>): Promise<number> {
    try {
      return await this.repository.count({ where: condition });
    } catch (error) {
      throw new BadRequestException('Ошибка при подсчете элементов');
    }
  }

  /**
   * Получить элементы с пагинацией
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    options?: FindManyOptions<T>
  ): Promise<{ data: T[]; total: number; page: number; limit: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await this.repository.findAndCount({
        ...options,
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
    } catch (error) {
      throw new BadRequestException('Ошибка при получении элементов с пагинацией');
    }
  }

  /**
   * Мягкое удаление (soft delete) - если поддерживается
   */
  async softDelete(id: number): Promise<void> {
    try {
      const result = await this.repository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Элемент с ID ${id} не найден`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при мягком удалении элемента');
    }
  }

  /**
   * Восстановить мягко удаленный элемент - если поддерживается
   */
  async restore(id: number): Promise<void> {
    try {
      const result = await this.repository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Элемент с ID ${id} не найден`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при восстановлении элемента');
    }
  }

  /**
   * Получить статистику
   */
  async getStats(): Promise<any> {
    try {
      const total = await this.count();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCount = await this.repository.count({
        where: {
          createdAt: today as any,
        } as any,
      });

      return {
        total,
        todayCount,
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw new BadRequestException('Ошибка при получении статистики');
    }
  }
}
