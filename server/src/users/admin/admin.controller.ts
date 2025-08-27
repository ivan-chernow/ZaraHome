import { Controller, Patch, Body, UseGuards, Req, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ResponseService } from 'src/shared/services/response.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from '../user/dto/user.dto';
import { Product } from 'src/products/entity/products.entity';
import { ImagesUploadInterceptor } from 'src/shared/upload/file-upload.helper';
import type { Multer } from 'multer';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(
        private readonly adminService: AdminService, 
        private readonly userService: UserService,
        private readonly responseService: ResponseService,
    ) { }

    @Post('add')
    @UseInterceptors(ImagesUploadInterceptor({ fieldName: 'images', maxCount: 12, maxSizeMB: 10 }))
    async addProduct(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() productData: CreateProductDto
    ) {
        const product = await this.adminService.addProduct(files, productData);
        return this.responseService.success(product, 'Продукт успешно добавлен администратором');
    }
} 