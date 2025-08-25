import { Controller, Post, Delete, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { CartService } from './cart.services';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  async add(@Req() req: AuthenticatedRequest, @Param('productId') productId: string) {
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
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.cartService.findAll(userId);
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
