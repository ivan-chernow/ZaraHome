import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { Product } from '../products/entity/products.entity';
import { ProductsModule } from '../products/products.module';
import { User } from './user/entity/user.entity';
import { DeliveryAddress } from './user/entity/delivery-address.entity';
import { SharedModule } from '../shared/modules/shared.module';
import { AppCacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DeliveryAddress, Product]),
    ProductsModule,
    SharedModule,
    AppCacheModule,
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserRepository, AdminService],
  exports: [UserService, AdminService],
})
export class UsersModule {}
