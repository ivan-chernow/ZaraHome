import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query, ParseArrayPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ResponseService } from 'src/shared/services/response.service';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { FavoriteProductIdDto } from './dto/product-id.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':productId')
  async add(@Param() params: FavoriteProductIdDto, @Req() req: AuthenticatedRequest) {
    const result = await this.favoritesService.add(req.user.id, params.productId);
    return this.responseService.success(result, 'Товар добавлен в избранное');
  }

  @Delete(':productId')
  async remove(@Param() params: FavoriteProductIdDto, @Req() req: AuthenticatedRequest) {
    await this.favoritesService.remove(req.user.id, params.productId);
    return this.responseService.success(undefined, 'Товар удален из избранного');
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const favorites = await this.favoritesService.findAll(req.user.id);
    return this.responseService.success(favorites, 'Избранное загружено');
  }

  @Get('status')
  async getFavoriteStatus(
    @Req() req: AuthenticatedRequest,
    @Query('productIds', new ParseArrayPipe({ items: Number, separator: ',' })) productIds: number[],
  ) {
    const status = await this.favoritesService.getFavoriteStatus(req.user.id, productIds);
    return this.responseService.success(status, 'Статус избранного получен');
  }
}
