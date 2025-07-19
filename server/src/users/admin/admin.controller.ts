import { Controller, Patch, Body, UseGuards, Req, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UserRole } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from '../user/dto/user.dto';
import { Product } from 'src/products/entity/products.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService, private readonly userService: UserService) { }

    @Post('add')
    @UseInterceptors(FilesInterceptor('images', 12, {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }))
    async addProduct(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() productData: CreateProductDto
    ) {
        return this.adminService.addProduct(files, productData);
    }

} 