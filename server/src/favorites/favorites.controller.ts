import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query, ParseArrayPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':productId')
  async add(@Param('productId') productId: string, @Req() req: AuthenticatedRequest) {
    try {
      const result = await this.favoritesService.add(req.user.id, +productId);
      return this.responseService.success(result, 'Товар добавлен в избранное');
    } catch (error) {
      return this.responseService.error('Ошибка при добавлении товара в избранное', error.message);
    }
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string, @Req() req: AuthenticatedRequest) {
    try {
      await this.favoritesService.remove(req.user.id, +productId);
      return this.responseService.success(undefined, 'Товар удален из избранного');
    } catch (error) {
      return this.responseService.error('Ошибка при удалении товара из избранного', error.message);
    }
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    try {
      const favorites = await this.favoritesService.findAll(req.user.id);
      return this.responseService.success(favorites, 'Избранное загружено');
    } catch (error) {
      return this.responseService.error('Ошибка при загрузке избранного', error.message);
    }
  }

  @Get('status')
  async getFavoriteStatus(
    @Req() req: AuthenticatedRequest,
    @Query('productIds', new ParseArrayPipe({ items: Number, separator: ',' })) productIds: number[],
  ) {
    try {
      const status = await this.favoritesService.getFavoriteStatus(req.user.id, productIds);
      return this.responseService.success(status, 'Статус избранного получен');
    } catch (error) {
      return this.responseService.error('Ошибка при получении статуса избранного', error.message);
    }
  }
}
