import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/shared/shared.interfaces';
import { ImagesUploadInterceptor } from 'src/shared/upload/file-upload.helper';
import { Product, Category } from '../shared/shared.interfaces';
import { ApiResponse } from '../shared/shared.interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseService } from 'src/shared/services/response.service';
import { ResourceNotFoundException } from 'src/shared/shared.interfaces';
import { PRODUCTS_CONSTANTS } from './products.constants';
import { FindProductsQueryDto } from './dto/find-products.query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly productsService: ProductsService;
  private readonly responseService: ResponseService;

  constructor(
    productsService: ProductsService,
    responseService: ResponseService
  ) {
    this.productsService = productsService;
    this.responseService = responseService;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    ImagesUploadInterceptor({
      fieldName: 'images',
      maxCount: 10,
      maxSizeMB: 10,
    })
  )
  @ApiOperation({ summary: 'Создать продукт' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные продукта и изображения',
    type: CreateProductDto,
  })
  @ApiCreatedResponse({ description: 'Продукт успешно создан' })
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<ApiResponse<Product>> {
    const product = await this.productsService.createProduct(dto, files);
    return this.responseService.success(
      product,
      PRODUCTS_CONSTANTS.SUCCESS.PRODUCT_CREATED
    );
  }

  @Get()
  @ApiOperation({ summary: 'Получить все продукты с фильтрацией и пагинацией' })
  @ApiOkResponse({ description: 'Продукты успешно загружены' })
  async findAll(@Query() query: FindProductsQueryDto): Promise<
    ApiResponse<{
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>
  > {
    const {
      page,
      limit,
      categoryId,
      subCategoryId,
      typeId,
      minPrice,
      maxPrice,
      isNew,
      hasDiscount,
      isAvailable,
      search,
      sortField,
      sortOrder,
    } = query;

    const filters = {
      categoryId,
      subCategoryId,
      typeId,
      minPrice,
      maxPrice,
      isNew,
      hasDiscount,
      isAvailable,
      search,
    };

    const sort =
      sortField && sortOrder
        ? { field: sortField, order: sortOrder }
        : undefined;
    const pagination = {
      page: page || 1,
      limit: limit || PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE,
    };

    const result = await this.productsService.findAll(
      filters,
      sort,
      pagination
    );
    return this.responseService.success(
      result,
      PRODUCTS_CONSTANTS.SUCCESS.PRODUCTS_LOADED
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск продуктов' })
  @ApiOkResponse({ description: 'Поиск завершен' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Поисковый запрос',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество результатов',
  })
  async searchProducts(
    @Query('q') query: string,
    @Query('limit') limit?: number
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService.searchProducts(query, limit);
    return this.responseService.success(
      products,
      PRODUCTS_CONSTANTS.SUCCESS.SEARCH_COMPLETED
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику продуктов' })
  @ApiOkResponse({ description: 'Статистика получена' })
  async getProductStats(): Promise<
    ApiResponse<{
      total: number;
      available: number;
      new: number;
      discounted: number;
      categories: number;
    }>
  > {
    const stats = await this.productsService.getProductStats();
    return this.responseService.success(stats, 'Статистика получена');
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Получить весь каталог с категориями' })
  @ApiOkResponse({ description: 'Каталог успешно загружен' })
  async getCatalog(): Promise<ApiResponse<Category[]>> {
    const catalog = await this.productsService.getCatalog();
    return this.responseService.success(
      catalog,
      PRODUCTS_CONSTANTS.SUCCESS.CATALOG_LOADED
    );
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить новые продукты' })
  @ApiOkResponse({ description: 'Новые продукты загружены' })
  async getNewProducts(): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService.findNewProducts();
    return this.responseService.success(products, 'Новые продукты загружены');
  }

  @Get('discounted')
  @ApiOperation({ summary: 'Получить продукты со скидками' })
  @ApiOkResponse({ description: 'Продукты со скидками загружены' })
  async getDiscountedProducts(): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService.findDiscountedProducts();
    return this.responseService.success(
      products,
      'Продукты со скидками загружены'
    );
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Получить продукты по категории' })
  @ApiOkResponse({ description: 'Продукты категории загружены' })
  @ApiParam({ name: 'categoryId', type: Number, description: 'ID категории' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество продуктов',
  })
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('limit') limit?: number
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService[
      'productsRepository'
    ].getProductsByCategory(categoryId, limit);
    return this.responseService.success(
      products,
      'Продукты категории загружены'
    );
  }

  @Get('subcategory/:subCategoryId')
  @ApiOperation({ summary: 'Получить продукты по подкатегории' })
  @ApiOkResponse({ description: 'Продукты подкатегории загружены' })
  @ApiParam({
    name: 'subCategoryId',
    type: Number,
    description: 'ID подкатегории',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество продуктов',
  })
  async getProductsBySubCategory(
    @Param('subCategoryId') subCategoryId: number,
    @Query('limit') limit?: number
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService[
      'productsRepository'
    ].getProductsBySubCategory(subCategoryId, limit);
    return this.responseService.success(
      products,
      'Продукты подкатегории загружены'
    );
  }

  @Get('type/:typeId')
  @ApiOperation({ summary: 'Получить продукты по типу' })
  @ApiOkResponse({ description: 'Продукты типа загружены' })
  @ApiParam({ name: 'typeId', type: Number, description: 'ID типа' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество продуктов',
  })
  async getProductsByType(
    @Param('typeId') typeId: number,
    @Query('limit') limit?: number
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService[
      'productsRepository'
    ].getProductsByType(typeId, limit);
    return this.responseService.success(products, 'Продукты типа загружены');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить продукт по id' })
  @ApiOkResponse({ description: 'Продукт найден' })
  @ApiNotFoundResponse({ description: 'Продукт не найден' })
  @ApiParam({ name: 'id', type: Number, description: 'ID продукта' })
  async findOne(@Param() params: ProductIdDto): Promise<ApiResponse<Product>> {
    const product = await this.productsService.findOne(params.id);
    if (!product) {
      throw new ResourceNotFoundException('Продукт не найден');
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
  ): Promise<ApiResponse<Product>> {
    const product = await this.productsService.update(params.id, dto);
    return this.responseService.success(
      product,
      PRODUCTS_CONSTANTS.SUCCESS.PRODUCT_UPDATED
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiOkResponse({ description: 'Продукт успешно удален' })
  @ApiParam({ name: 'id', type: Number, description: 'ID продукта' })
  async deleteProduct(
    @Param() params: ProductIdDto
  ): Promise<ApiResponse<void>> {
    await this.productsService.delete(params.id);
    return this.responseService.success(
      undefined,
      PRODUCTS_CONSTANTS.SUCCESS.PRODUCT_DELETED
    );
  }

  @Delete('batch/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить несколько продуктов' })
  @ApiOkResponse({ description: 'Продукты успешно удалены' })
  @ApiBody({
    description: 'Массив ID продуктов для удаления',
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Массив ID продуктов',
        },
      },
    },
  })
  async deleteMultipleProducts(
    @Body() body: { ids: number[] }
  ): Promise<ApiResponse<{ deleted: number; failed: number }>> {
    const result = await this.productsService.deleteMultiple(body.ids);
    return this.responseService.success(
      result,
      PRODUCTS_CONSTANTS.SUCCESS.PRODUCTS_DELETED
    );
  }

  @Post('batch/ids')
  @ApiOperation({ summary: 'Получить продукты по массиву ID' })
  @ApiOkResponse({ description: 'Продукты получены' })
  @ApiBody({
    description: 'Массив ID продуктов',
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Массив ID продуктов',
        },
      },
    },
  })
  async getProductsByIds(
    @Body() body: { ids: number[] }
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService.findByIds(body.ids);
    return this.responseService.success(products, 'Продукты получены');
  }
}
