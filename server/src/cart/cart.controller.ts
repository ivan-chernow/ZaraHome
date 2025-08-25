import { Controller, Post, Delete, Get, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { CartService } from './cart.services';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  async add(
    @Req() req: AuthenticatedRequest, 
    @Param('productId') productId: string,
    @Body() dto: AddToCartDto
  ) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, Number(productId));
  }

  @Delete(':productId')
  async remove(@Req() req: AuthenticatedRequest, @Param('productId') productId: string) {
    const userId = req.user.id;
    await this.cartService.removeFromCart(userId, Number(productId));
    return { success: true };
  }

  @Get()
  @SkipThrottle()
  async getUserCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.cartService.getUserCart(userId);
  }

  @Get('status')
  @SkipThrottle()
  async status(@Req() req: AuthenticatedRequest, @Query('productIds') productIds: string) {
    const userId = req.user.id;
    const ids = (productIds || '')
      .split(',')
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    return this.cartService.getCartStatus(userId, ids);
  }
}
