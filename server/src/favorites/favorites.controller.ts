import { Controller, Post, Delete, Get, Param, UseGuards, Req, Query, ParseArrayPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/login/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/login/types/authenticated-request.interface';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  add(@Param('productId') productId: string, @Req() req: AuthenticatedRequest) {
    return this.favoritesService.add(req.user.userId, +productId);
  }

  @Delete(':productId')
  remove(@Param('productId') productId: string, @Req() req: AuthenticatedRequest) {
    return this.favoritesService.remove(req.user.userId, +productId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.favoritesService.findAll(req.user.userId);
  }

  @Get('status')
  getFavoriteStatus(
    @Req() req: AuthenticatedRequest,
    @Query('productIds', new ParseArrayPipe({ items: Number, separator: ',' })) productIds: number[],
  ) {
    return this.favoritesService.getFavoriteStatus(req.user.userId, productIds);
  }
}
