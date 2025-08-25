import { Controller, Post, Body, UseGuards, Get, Param, UseInterceptors, UploadedFiles, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user/entity/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageOptimizationService } from 'src/shared/services/image-optimization.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly imageOptimizationService: ImageOptimizationService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: memoryStorage(),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new Error('Разрешены только файлы изображений!'), false);
            }
            callback(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 }
    }))
    async createProduct(
        @Body() dto: CreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        try {
            if (files && files.length > 0) {
                dto.img = await this.imageOptimizationService.processMany(files);
            }
            
            // Преобразуем строковые значения в числа
            if (dto.categoryId) dto.categoryId = parseInt(dto.categoryId as any);
            if (dto.subCategoryId) dto.subCategoryId = parseInt(dto.subCategoryId as any);
            if (dto.typeId) dto.typeId = parseInt(dto.typeId as any);
            
            // Преобразуем JSON-строки в объекты
            if (typeof dto.colors === 'string') {
                dto.colors = JSON.parse(dto.colors);
            }
            if (typeof dto.size === 'string') {
                dto.size = JSON.parse(dto.size);
            }

            // Преобразуем строковые булевы значения
            if (typeof dto.isNew === 'string') {
                dto.isNew = dto.isNew === 'true';
            }
            if (typeof dto.isAvailable === 'string') {
                dto.isAvailable = dto.isAvailable === 'true';
            }
            
            return this.productsService.createProduct(dto);
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    }

    
    @Get('catalog')
    async getCatalog() {
        return this.productsService.getCatalog();
    }

    @Get()
    async getProductsByIds(@Query('ids') ids: string) {
        if (!ids) return [];
        const idsArray = ids.split(',').map(id => Number(id)).filter(Boolean);
        return this.productsService.findByIds(idsArray);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(parseInt(id));
    }
}
