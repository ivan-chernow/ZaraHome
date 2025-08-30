import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { Order } from './entity/order.entity';
import { User } from '../users/user/entity/user.entity';
import { AppCacheModule } from '../shared/cache/cache.module';
import { PromocodesModule } from '../promocodes/promocodes.module';
import { SharedModule } from '../shared/modules/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    AppCacheModule,
    PromocodesModule,
    SharedModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
