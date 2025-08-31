import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { FavoritesService } from './favorites.service';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/shared/shared.interfaces';
import { FavoriteProductIdDto } from './dto/product-id.dto';
import { ProductIdsQueryDto } from './dto/product-ids-query.dto';
import { AddMultipleToFavoritesDto } from './dto/add-multiple-to-favorites.dto';
import { RemoveMultipleFromFavoritesDto } from './dto/remove-multiple-from-favorites.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { ApiDefaultErrors } from 'src/shared/shared.interfaces';
import { FAVORITES_CONSTANTS } from './favorites.constants';

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
    return this.responseService.success(result, FAVORITES_CONSTANTS.SUCCESS.ITEM_ADDED);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Добавить несколько товаров в избранное' })
  @ApiOkResponse({ description: 'Товары добавлены в избранное' })
  @ApiBody({ type: AddMultipleToFavoritesDto })
  async addMultiple(
    @Req() req: AuthenticatedRequest,
    @Body() body: AddMultipleToFavoritesDto
  ) {
    const result = await this.favoritesService.addMultiple(req.user.id, body.productIds);
    return this.responseService.success(result, FAVORITES_CONSTANTS.SUCCESS.ITEMS_ADDED);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiOkResponse({ description: 'Товар удален из избранного' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async remove(@Param() params: FavoriteProductIdDto, @Req() req: AuthenticatedRequest) {
    await this.favoritesService.remove(req.user.id, params.productId);
    return this.responseService.success(undefined, FAVORITES_CONSTANTS.SUCCESS.ITEM_REMOVED);
  }

  @Delete('multiple')
  @ApiOperation({ summary: 'Удалить несколько товаров из избранного' })
  @ApiOkResponse({ description: 'Товары удалены из избранного' })
  @ApiBody({ type: RemoveMultipleFromFavoritesDto })
  async removeMultiple(
    @Req() req: AuthenticatedRequest,
    @Body() body: RemoveMultipleFromFavoritesDto
  ) {
    await this.favoritesService.removeMultiple(req.user.id, body.productIds);
    return this.responseService.success(undefined, FAVORITES_CONSTANTS.SUCCESS.ITEMS_REMOVED);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить избранное пользователя' })
  @ApiOkResponse({ description: 'Избранное очищено' })
  async clearFavorites(@Req() req: AuthenticatedRequest) {
    await this.favoritesService.clearFavorites(req.user.id);
    return this.responseService.success(undefined, FAVORITES_CONSTANTS.SUCCESS.FAVORITES_CLEARED);
  }

  @Get()
  @SkipThrottle()
  @ApiOperation({ summary: 'Получить избранные товары пользователя' })
  @ApiOkResponse({ description: 'Избранное загружено' })
  async findAll(@Req() req: AuthenticatedRequest) {
    const favorites = await this.favoritesService.findAll(req.user.id);
    return this.responseService.success(favorites, FAVORITES_CONSTANTS.SUCCESS.FAVORITES_LOADED);
  }

  @Get('count')
  @SkipThrottle()
  @ApiOperation({ summary: 'Получить количество товаров в избранном' })
  @ApiOkResponse({ description: 'Количество товаров получено' })
  async getFavoritesCount(@Req() req: AuthenticatedRequest) {
    const count = await this.favoritesService.getFavoritesCount(req.user.id);
    return this.responseService.success({ count }, FAVORITES_CONSTANTS.SUCCESS.COUNT_LOADED);
  }

  @Get('status')
  @SkipThrottle()
  @ApiOperation({ summary: 'Проверить статус избранного для списка товаров' })
  @ApiOkResponse({ description: 'Статус избранного получен' })
  @ApiQuery({ name: 'productIds', type: String, required: true, example: '1,2,3', description: 'Список ID через запятую' })
  async getFavoriteStatus(@Req() req: AuthenticatedRequest, @Query() query: ProductIdsQueryDto) {
    const status = await this.favoritesService.getFavoriteStatus(req.user.id, query.productIds);
    return this.responseService.success(status, FAVORITES_CONSTANTS.SUCCESS.STATUS_LOADED);
  }
}
