import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocode } from './entity/promocode.entity';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectRepository(Promocode)
    private promocodeRepository: Repository<Promocode>,
  ) {}

  // Создание промокода (для админа)
  async create(code: string, discount: number): Promise<Promocode> {
    // Проверяем, не существует ли уже такой промокод
    const existingPromocode = await this.promocodeRepository.findOne({
      where: { code: code.toUpperCase() }
    });

    if (existingPromocode) {
      throw new Error('Промокод с таким кодом уже существует');
    }

    const promocode = this.promocodeRepository.create({
      code: code.toUpperCase(),
      discount,
      isActive: true
    });

    return await this.promocodeRepository.save(promocode);
  }

  // Проверка и применение промокода
  async validateAndApply(code: string, orderAmount: number): Promise<{ 
    isValid: boolean; 
    message?: string; 
    discount?: number;
    finalAmount?: number;
  }> {
    const promocode = await this.promocodeRepository.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true 
      }
    });

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
    return await this.promocodeRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'DESC' // Сначала показываем новые промокоды
      }
    });
  }

  // Деактивация промокода (для админа)
  async deactivate(code: string): Promise<void> {
    const promocode = await this.promocodeRepository.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!promocode) {
      throw new Error('Промокод не найден');
    }

    if (!promocode.isActive) {
      throw new Error('Промокод уже деактивирован');
    }

    await this.promocodeRepository.update(
      { code: code.toUpperCase() },
      { isActive: false }
    );
  }
} 