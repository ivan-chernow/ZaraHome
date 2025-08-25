import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageOptimizationService } from 'src/shared/services/image-optimization.service';
import { 
  ICreateProductDto, 
  IUpdateProductDto, 
  IProduct, 
  ICategory,
  ApiResponse 
} from '../common/interfaces';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly imageOptimizationService: ImageOptimizationService
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
        @Body() dto: ICreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<ApiResponse<IProduct>> {
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
            
            const product = await this.productsService.create(dto);
            return {
                success: true,
                data: product,
                message: 'Продукт успешно создан'
            };
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            return {
                success: false,
                message: 'Ошибка при создании продукта',
                error: error.message
            };
        }
    }

    @Get()
    async findAll(): Promise<ApiResponse<IProduct[]>> {
        try {
            const products = await this.productsService.findAll();
            return {
                success: true,
                data: products,
                message: 'Продукты успешно загружены'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка при загрузке продуктов',
                error: error.message
            };
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ApiResponse<IProduct>> {
        try {
            const product = await this.productsService.findOne(+id);
            if (!product) {
                return {
                    success: false,
                    message: 'Продукт не найден'
                };
            }
            return {
                success: true,
                data: product,
                message: 'Продукт найден'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка при поиске продукта',
                error: error.message
            };
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async updateProduct(
        @Param('id') id: string,
        @Body() dto: IUpdateProductDto
    ): Promise<ApiResponse<IProduct>> {
        try {
            const product = await this.productsService.update(+id, dto);
            return {
                success: true,
                data: product,
                message: 'Продукт успешно обновлен'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка при обновлении продукта',
                error: error.message
            };
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async deleteProduct(@Param('id') id: string): Promise<ApiResponse<void>> {
        try {
            await this.productsService.delete(+id);
            return {
                success: true,
                message: 'Продукт успешно удален'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка при удалении продукта',
                error: error.message
            };
        }
    }

    @Get('catalog/all')
    async getCatalog(): Promise<ApiResponse<ICategory[]>> {
        try {
            const catalog = await this.productsService.getCatalog();
            return {
                success: true,
                data: catalog,
                message: 'Каталог успешно загружен'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка при загрузке каталога',
                error: error.message
            };
        }
    }
}
