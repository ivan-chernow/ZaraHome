import { Controller, Post, Delete, Get, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { CartService } from './cart.services';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
//
import { ProductIdDto } from './dto/product-id.dto';
import { ProductIdsQueryDto } from './dto/product-ids-query.dto';
import { AddMultipleToCartDto } from './dto/add-multiple-to-cart.dto';
import { RemoveMultipleFromCartDto } from './dto/remove-multiple-from-cart.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { ApiDefaultErrors } from 'src/common/swagger/swagger.decorators';
import { CART_CONSTANTS } from './cart.constants';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiDefaultErrors()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiOkResponse({ description: 'Товар добавлен в корзину' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async add(
    @Req() req: AuthenticatedRequest, 
    @Param() params: ProductIdDto
  ) {
    const userId = req.user.id;
    const result = await this.cartService.addToCart(userId, params.productId);
    return this.responseService.success(result, CART_CONSTANTS.SUCCESS.ITEM_ADDED);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Добавить несколько товаров в корзину' })
  @ApiOkResponse({ description: 'Товары добавлены в корзину' })
  @ApiBody({ type: AddMultipleToCartDto })
  async addMultiple(
    @Req() req: AuthenticatedRequest,
    @Body() body: AddMultipleToCartDto
  ) {
    const userId = req.user.id;
    const result = await this.cartService.addMultipleToCart(userId, body.productIds);
    return this.responseService.success(result, CART_CONSTANTS.SUCCESS.ITEMS_ADDED);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiOkResponse({ description: 'Товар удален из корзины' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async remove(@Req() req: AuthenticatedRequest, @Param() params: ProductIdDto) {
    const userId = req.user.id;
    await this.cartService.removeFromCart(userId, params.productId);
    return this.responseService.success(undefined, CART_CONSTANTS.SUCCESS.ITEM_REMOVED);
  }

  @Delete('multiple')
  @ApiOperation({ summary: 'Удалить несколько товаров из корзины' })
  @ApiOkResponse({ description: 'Товары удалены из корзины' })
  @ApiBody({ type: RemoveMultipleFromCartDto })
  async removeMultiple(
    @Req() req: AuthenticatedRequest,
    @Body() body: RemoveMultipleFromCartDto
  ) {
    const userId = req.user.id;
    await this.cartService.removeMultipleFromCart(userId, body.productIds);
    return this.responseService.success(undefined, CART_CONSTANTS.SUCCESS.ITEMS_REMOVED);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину пользователя' })
  @ApiOkResponse({ description: 'Корзина очищена' })
  async clearCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    await this.cartService.clearCart(userId);
    return this.responseService.success(undefined, CART_CONSTANTS.SUCCESS.CART_CLEARED);
  }

  @Get()
  @SkipThrottle()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiOkResponse({ description: 'Корзина загружена' })
  async getUserCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const cart = await this.cartService.getUserCart(userId);
    return this.responseService.success(cart, CART_CONSTANTS.SUCCESS.CART_LOADED);
  }

  @Get('count')
  @SkipThrottle()
  @ApiOperation({ summary: 'Получить количество товаров в корзине' })
  @ApiOkResponse({ description: 'Количество товаров получено' })
  async getCartItemCount(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const count = await this.cartService.getCartItemCount(userId);
    return this.responseService.success({ count }, CART_CONSTANTS.SUCCESS.COUNT_LOADED);
  }

  @Get('status')
  @SkipThrottle()
  @ApiOperation({ summary: 'Проверить статус товаров в корзине' })
  @ApiOkResponse({ description: 'Статус корзины получен' })
  @ApiQuery({ name: 'productIds', type: String, required: true, example: '1,2,3', description: 'Список ID через запятую' })
  async status(@Req() req: AuthenticatedRequest, @Query() query: ProductIdsQueryDto) {
    const userId = req.user.id;
    const status = await this.cartService.getCartStatus(userId, query.productIds);
    return this.responseService.success(status, CART_CONSTANTS.SUCCESS.STATUS_LOADED);
  }
}
