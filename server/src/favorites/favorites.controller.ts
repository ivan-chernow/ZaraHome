import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query, ParseArrayPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { FavoriteProductIdDto } from './dto/product-id.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiDefaultErrors } from 'src/common/swagger/swagger.decorators';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiDefaultErrors()
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Добавить товар в избранное' })
  @ApiOkResponse({ description: 'Товар добавлен в избранное' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async add(@Param() params: FavoriteProductIdDto, @Req() req: AuthenticatedRequest) {
    const result = await this.favoritesService.add(req.user.id, params.productId);
    return this.responseService.success(result, 'Товар добавлен в избранное');
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiOkResponse({ description: 'Товар удален из избранного' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async remove(@Param() params: FavoriteProductIdDto, @Req() req: AuthenticatedRequest) {
    await this.favoritesService.remove(req.user.id, params.productId);
    return this.responseService.success(undefined, 'Товар удален из избранного');
  }

  @Get()
  @ApiOperation({ summary: 'Получить избранные товары пользователя' })
  @ApiOkResponse({ description: 'Избранное загружено' })
  async findAll(@Req() req: AuthenticatedRequest) {
    const favorites = await this.favoritesService.findAll(req.user.id);
    return this.responseService.success(favorites, 'Избранное загружено');
  }

  @Get('status')
  @ApiOperation({ summary: 'Проверить статус избранного для списка товаров' })
  @ApiOkResponse({ description: 'Статус избранного получен' })
  @ApiQuery({ name: 'productIds', type: String, example: '1,2,3', description: 'Список ID через запятую' })
  async getFavoriteStatus(
    @Req() req: AuthenticatedRequest,
    @Query('productIds', new ParseArrayPipe({ items: Number, separator: ',' })) productIds: number[],
  ) {
    const status = await this.favoritesService.getFavoriteStatus(req.user.id, productIds);
    return this.responseService.success(status, 'Статус избранного получен');
  }
}
