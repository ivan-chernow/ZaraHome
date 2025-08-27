import { Injectable } from '@nestjs/common';
import { Promocode } from './entity/promocode.entity';
import { PromocodesRepository } from './promocodes.repository';
import { IPromocodeService } from 'src/common/interfaces/service.interface';

@Injectable()
export class PromocodesService implements IPromocodeService {
  constructor(
    private readonly promocodesRepository: PromocodesRepository,
  ) {}

  // Создание промокода (для админа)
  async create(code: string, discount: number): Promise<Promocode> {
    // Проверяем, не существует ли уже такой промокод
    const existingPromocode = await this.promocodesRepository.findByCode(code);

    if (existingPromocode) {
      throw new Error('Промокод с таким кодом уже существует');
    }

    return this.promocodesRepository.createPromocode({
      code: code.toUpperCase(),
      discount,
      isActive: true
    });
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
      return { 
        isValid: false, 
        message: 'Промокод не найден или недействителен' 
      };
    }

    // Проверяем, что сумма заказа больше 0
    if (orderAmount <= 0) {
      return {
        isValid: false,
        message: 'Сумма заказа должна быть больше 0'
      };
    }

    // Проверяем, что скидка не больше 100%
    if (promocode.discount > 100) {
      return {
        isValid: false,
        message: 'Некорректный размер скидки'
      };
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
    return await this.promocodesRepository.findAllActive();
  }

  // Получение всех промокодов (активных и неактивных)
  async getAll(): Promise<Promocode[]> {
    return await this.promocodesRepository.findAll();
  }

  // Деактивация/удаление промокода (для админа)
  async deactivate(code: string): Promise<void> {
    const promocode = await this.promocodesRepository.findByCode(code);

    if (!promocode) {
      throw new Error('Промокод не найден');
    }

    // Жёсткое удаление записи из БД по запросу "деактивировать"
    await this.promocodesRepository.deleteByCode(code);
  }
} 