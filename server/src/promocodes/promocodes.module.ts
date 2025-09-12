import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';
import { PromocodesRepository } from './promocodes.repository';
import { Promocode } from './entity/promocode.entity';
import { SharedModule } from '../shared/modules/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Promocode]), SharedModule],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
  exports: [PromocodesService, PromocodesRepository],
})
export class PromocodesModule {}
