import { Controller, Body, UseGuards, Post, Get, UseInterceptors, UploadedFiles, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ResponseService } from '../../shared/services/response.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserService } from '../user/user.service';
import { ImagesUploadInterceptor } from '../../shared/upload/file-upload.helper';
import { CreateProductDto } from '../../products/dto/create-product.dto';

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

    @Get('upload-stats')
    async getUploadStatistics() {
        const stats = this.adminService.getUploadStatistics();
        return this.responseService.success(stats, 'Статистика загрузок получена');
    }

    @Get('system-warnings')
    async getSystemWarnings() {
        const warnings = this.adminService.getSystemWarnings();
        return this.responseService.success(warnings, 'Предупреждения системы получены');
    }

    @Delete('upload-history')
    async clearUploadHistory() {
        this.adminService.clearUploadHistory();
        return this.responseService.success(null, 'История загрузок очищена');
    }
} 