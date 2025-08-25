import { Controller, Post, Delete, Get, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { CartService } from './cart.services';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { ProductIdDto } from './dto/product-id.dto';
import { ProductIdsQueryDto } from './dto/product-ids-query.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':productId')
  async add(
    @Req() req: AuthenticatedRequest, 
    @Param() params: ProductIdDto,
    @Body() dto: AddToCartDto
  ) {
    try {
      const userId = req.user.id;
      const result = await this.cartService.addToCart(userId, params.productId);
      return this.responseService.success(result, 'Товар добавлен в корзину');
    } catch (error) {
      return this.responseService.error('Ошибка при добавлении товара в корзину', error.message);
    }
  }

  @Delete(':productId')
  async remove(@Req() req: AuthenticatedRequest, @Param() params: ProductIdDto) {
    try {
      const userId = req.user.id;
      await this.cartService.removeFromCart(userId, params.productId);
      return this.responseService.success(undefined, 'Товар удален из корзины');
    } catch (error) {
      return this.responseService.error('Ошибка при удалении товара из корзины', error.message);
    }
  }

  @Get()
  @SkipThrottle()
  async getUserCart(@Req() req: AuthenticatedRequest) {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.getUserCart(userId);
      return this.responseService.success(cart, 'Корзина загружена');
    } catch (error) {
      return this.responseService.error('Ошибка при загрузке корзины', error.message);
    }
  }

  @Get('status')
  @SkipThrottle()
  async status(@Req() req: AuthenticatedRequest, @Query() query: ProductIdsQueryDto) {
    try {
      const userId = req.user.id;
      const status = await this.cartService.getCartStatus(userId, query.productIds);
      return this.responseService.success(status, 'Статус корзины получен');
    } catch (error) {
      return this.responseService.error('Ошибка при получении статуса корзины', error.message);
    }
  }
}
