import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { OrderStatus } from './entity/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const user = req.user;
    return await this.ordersService.createOrder(createOrderDto, user);
  }

  @Get('my')
  async getUserOrders(@Request() req) {
    const user = req.user;
    return await this.ordersService.getUserOrders(user.id);
  }

  @Get('active')
  async getActiveOrder(@Request() req) {
    const user = req.user;
    return await this.ordersService.getActiveOrder(user.id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return await this.ordersService.getOrderById(parseInt(id), user.id);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Request() req
  ) {
    const user = req.user;
    return await this.ordersService.updateOrderStatus(parseInt(id), status, user.id);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return await this.ordersService.cancelOrder(parseInt(id), user.id);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req
  ) {
    const user = req.user;
    return await this.ordersService.updateOrder(parseInt(id), updateOrderDto, user.id);
  }
}
