import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { Product } from 'src/products/entity/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { User } from './user/entity/user.entity';
import { DeliveryAddress } from './user/entity/delivery-address.entity';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, DeliveryAddress, Product]),
        ProductsModule,
        SharedModule
    ],
    controllers: [UserController, AdminController],
    providers: [UserService, AdminService,],
    exports: [UserService, AdminService]
})
export class UsersModule { }

