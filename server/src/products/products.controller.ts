import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ImagesUploadInterceptor } from 'src/shared/upload/file-upload.helper';
import { IProduct, ICategory } from '../common/interfaces/product.interface';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ResponseService } from 'src/shared/services/response.service';
import { ResourceNotFoundException } from 'src/common/base/base.exceptions';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(ImagesUploadInterceptor({ fieldName: 'images', maxCount: 10, maxSizeMB: 10 }))
    @ApiOperation({ summary: 'Создать продукт' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ description: 'Данные продукта и изображения', type: CreateProductDto })
    @ApiCreatedResponse({ description: 'Продукт успешно создан' })
    async createProduct(
        @Body() dto: CreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.createProduct(dto, files);
        return this.responseService.success(product, 'Продукт успешно создан');
    }

    @Get()
    @ApiOperation({ summary: 'Получить все продукты' })
    @ApiOkResponse({ description: 'Продукты успешно загружены' })
    async findAll(): Promise<ApiResponse<IProduct[]>> {
        const products = await this.productsService.findAll();
        return this.responseService.success(products, 'Продукты успешно загружены');
    }

    @Get('catalog')
    @ApiOperation({ summary: 'Получить весь каталог с категориями' })
    @ApiOkResponse({ description: 'Каталог успешно загружен' })
    async getCatalog(): Promise<ApiResponse<ICategory[]>> {
        const catalog = await this.productsService.getCatalog();
        return this.responseService.success(catalog, 'Каталог успешно загружен');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить продукт по id' })
    @ApiOkResponse({ description: 'Продукт найден' })
    @ApiNotFoundResponse({ description: 'Продукт не найден' })
    @ApiParam({ name: 'id', type: Number, description: 'ID продукта' })
    async findOne(@Param() params: ProductIdDto): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.findOne(params.id);
        if (!product) {
            throw new ResourceNotFoundException('Продукт', params.id);
        }
        return this.responseService.success(product, 'Продукт найден');
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Обновить продукт' })
    @ApiOkResponse({ description: 'Продукт успешно обновлен' })
    @ApiParam({ name: 'id', type: Number, description: 'ID продукта' })
    async updateProduct(
        @Param() params: ProductIdDto,
        @Body() dto: UpdateProductDto
    ): Promise<ApiResponse<IProduct>> {
        const product = await this.productsService.update(params.id, dto);
        return this.responseService.success(product, 'Продукт успешно обновлен');
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Удалить продукт' })
    @ApiOkResponse({ description: 'Продукт успешно удален' })
    @ApiParam({ name: 'id', type: Number, description: 'ID продукта' })
    async deleteProduct(@Param() params: ProductIdDto): Promise<ApiResponse<void>> {
        await this.productsService.delete(params.id);
        return this.responseService.success(undefined, 'Продукт успешно удален');
    }

}
