import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrdersController } from './orders.controller';
import { Order } from './entity/order.entity';
import { User } from 'src/users/user/entity/user.entity';
import { SharedModule } from '../shared/modules/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User]), SharedModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
