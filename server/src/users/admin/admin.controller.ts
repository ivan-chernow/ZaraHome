import {
  Controller,
  Body,
  UseGuards,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ResponseService } from '../../shared/services/response.service';
import { UserRole } from '../../shared/shared.interfaces';
import { ImagesUploadInterceptor } from '../../shared/upload/file-upload.helper';
import { CreateProductDto } from '../../products/dto/create-product.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  private readonly _adminService: AdminService;
  private readonly _responseService: ResponseService;

  constructor(adminService: AdminService, responseService: ResponseService) {
    this._adminService = adminService;
    this._responseService = responseService;
  }

  @Post('add')
  @UseInterceptors(
    ImagesUploadInterceptor({
      fieldName: 'images',
      maxCount: 12,
      maxSizeMB: 10,
    })
  )
  async addProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() productData: CreateProductDto
  ) {
    const product = await this._adminService.addProduct(files, productData);
    return this._responseService.success(
      product,
      'Продукт успешно добавлен администратором'
    );
  }

  @Get('upload-stats')
  async getUploadStatistics() {
    const stats = this._adminService.getUploadStatistics();
    return this._responseService.success(stats, 'Статистика загрузок получена');
  }

  @Get('system-warnings')
  async getSystemWarnings() {
    const warnings = this._adminService.getSystemWarnings();
    return this._responseService.success(
      warnings,
      'Предупреждения системы получены'
    );
  }

  @Delete('upload-history')
  async clearUploadHistory() {
    this._adminService.clearUploadHistory();
    return this._responseService.success(null, 'История загрузок очищена');
  }
}
