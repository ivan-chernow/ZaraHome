import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';
import { PromocodesRepository } from './promocodes.repository';
import { Promocode } from './entity/promocode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promocode])],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
  exports: [PromocodesService]
})
export class PromocodesModule {} 