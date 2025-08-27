import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ImagesUploadInterceptor } from 'src/shared/upload/file-upload.helper';
import { IProduct, ICategory, ApiResponse } from '../common/interfaces';
import { ResourceNotFoundException } from 'src/common/base/base.exceptions';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(ImagesUploadInterceptor({ fieldName: 'images', maxCount: 10, maxSizeMB: 10 }))
    async createProduct(
        @Body() dto: CreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.createProduct(dto, files);
        return this.responseService.success(product, 'Продукт успешно создан');
    }

    @Get()
    async findAll(): Promise<ApiResponse<IProduct[]>> {
        const products = await this.productsService.findAll();
        return this.responseService.success(products, 'Продукты успешно загружены');
    }

    @Get(':id')
    async findOne(@Param() params: ProductIdDto): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.findOne(params.id);
        if (!product) {
            throw new ResourceNotFoundException('Продукт', params.id);
        }
        return this.responseService.success(product, 'Продукт найден');
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async updateProduct(
        @Param() params: ProductIdDto,
        @Body() dto: UpdateProductDto
    ): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.update(params.id, dto);
        return this.responseService.success(product, 'Продукт успешно обновлен');
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    async deleteProduct(@Param() params: ProductIdDto): Promise<ApiResponse<void>> {
        await this.productsService.delete(params.id);
        return this.responseService.success(undefined, 'Продукт успешно удален');
    }

    @Get('catalog/all')
    async getCatalog(): Promise<ApiResponse<ICategory[]>> {
        const catalog = await this.productsService.getCatalog();
        return this.responseService.success(catalog, 'Каталог успешно загружен');
    }
}
