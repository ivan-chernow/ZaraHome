import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocode } from './entity/promocode.entity';

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectRepository(Promocode)
    private promocodeRepository: Repository<Promocode>,
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

  async findAll(): Promise<Promocode[]> {
    return this.promocodeRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createPromocode(promocodeData: Partial<Promocode>): Promise<Promocode> {
    const promocode = this.promocodeRepository.create(promocodeData);
    return this.promocodeRepository.save(promocode);
  }

  async deleteByCode(code: string): Promise<void> {
    await this.promocodeRepository.delete({ code: code.toUpperCase() });
  }
}
