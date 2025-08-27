import { Controller, Post, Delete, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { CartService } from './cart.services';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
//
import { ProductIdDto } from './dto/product-id.dto';
import { ProductIdsQueryDto } from './dto/product-ids-query.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiDefaultErrors } from 'src/common/swagger/swagger.decorators';

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
    return this.responseService.success(result, 'Товар добавлен в корзину');
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiOkResponse({ description: 'Товар удален из корзины' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID продукта' })
  async remove(@Req() req: AuthenticatedRequest, @Param() params: ProductIdDto) {
    const userId = req.user.id;
    await this.cartService.removeFromCart(userId, params.productId);
    return this.responseService.success(undefined, 'Товар удален из корзины');
  }

  @Get()
  @SkipThrottle()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiOkResponse({ description: 'Корзина загружена' })
  async getUserCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const cart = await this.cartService.getUserCart(userId);
    return this.responseService.success(cart, 'Корзина загружена');
  }

  @Get('status')
  @SkipThrottle()
  @ApiOperation({ summary: 'Проверить статус товаров в корзине' })
  @ApiOkResponse({ description: 'Статус корзины получен' })
  @ApiQuery({ name: 'productIds', type: String, required: true, example: '1,2,3', description: 'Список ID через запятую' })
  async status(@Req() req: AuthenticatedRequest, @Query() query: ProductIdsQueryDto) {
    const userId = req.user.id;
    const status = await this.cartService.getCartStatus(userId, query.productIds);
    return this.responseService.success(status, 'Статус корзины получен');
  }
}
