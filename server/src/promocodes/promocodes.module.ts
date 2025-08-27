import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';
import { PromocodesRepository } from './promocodes.repository';
import { Promocode } from './entity/promocode.entity';
import { SharedModule } from '../shared/modules/shared.module';
import { AppCacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promocode]), 
    SharedModule,
    AppCacheModule
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
  exports: [PromocodesService]
})
export class PromocodesModule {} 