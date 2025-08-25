import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrdersController } from './orders.controller';
import { Order } from './entity/order.entity';
import { User } from 'src/users/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
