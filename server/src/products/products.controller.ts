import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResponseService } from 'src/shared/services/response.service';
import { IProduct, ICategory, ApiResponse } from '../common/interfaces';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
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
    ): Promise<ApiResponse<IProduct>> {
        try {
            const product = await this.productsService.createProduct(dto, files);
            return this.responseService.success(product, 'Продукт успешно создан');
        } catch (error) {
            // лог уже формируется централизованно, возвращаем унифицированный ответ
            return this.responseService.error('Ошибка при создании продукта', error.message);
        }
    }

    @Get()
    async findAll(): Promise<ApiResponse<IProduct[]>> {
        try {
            const products = await this.productsService.findAll();
            return this.responseService.success(products, 'Продукты успешно загружены');
        } catch (error) {
            return this.responseService.error('Ошибка при загрузке продуктов', error.message);
        }
    }

    @Get(':id')
    async findOne(@Param() params: ProductIdDto): Promise<ApiResponse<IProduct>> {
        try {
            const product = await this.productsService.findOne(params.id);
            if (!product) {
                return this.responseService.error('Продукт не найден');
            }
            return this.responseService.success(product, 'Продукт найден');
        } catch (error) {
            return this.responseService.error('Ошибка при поиске продукта', error.message);
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async updateProduct(
        @Param() params: ProductIdDto,
        @Body() dto: UpdateProductDto
    ): Promise<ApiResponse<IProduct>> {
        try {
            const product = await this.productsService.update(params.id, dto);
            return this.responseService.success(product, 'Продукт успешно обновлен');
        } catch (error) {
            return this.responseService.error('Ошибка при обновлении продукта', error.message);
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async deleteProduct(@Param() params: ProductIdDto): Promise<ApiResponse<void>> {
        try {
            await this.productsService.delete(params.id);
            return this.responseService.success(undefined, 'Продукт успешно удален');
        } catch (error) {
            return this.responseService.error('Ошибка при удалении продукта', error.message);
        }
    }

    @Get('catalog/all')
    async getCatalog(): Promise<ApiResponse<ICategory[]>> {
        try {
            const catalog = await this.productsService.getCatalog();
            return this.responseService.success(catalog, 'Каталог успешно загружен');
        } catch (error) {
            return this.responseService.error('Ошибка при загрузке каталога', error.message);
        }
    }
}
