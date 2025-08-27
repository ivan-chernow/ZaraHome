import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: AuthenticatedRequest) {
    const order = await this.ordersService.createOrder(createOrderDto, req.user.id);
    return this.responseService.success(order, 'Заказ успешно создан');
  }

  @Get('my')
  async getUserOrders(@Request() req: AuthenticatedRequest) {
    const orders = await this.ordersService.getUserOrders(req.user.id);
    return this.responseService.success(orders, 'Заказы пользователя загружены');
  }

  @Get('active')
  async getActiveOrder(@Request() req: AuthenticatedRequest) {
    const order = await this.ordersService.getActiveOrder(req.user.id);
    return this.responseService.success(order, 'Активный заказ загружен');
  }

  @Get(':id')
  async getOrderById(@Param() params: OrderIdDto, @Request() req: AuthenticatedRequest) {
    const order = await this.ordersService.getOrderById(params.id, req.user.id);
    return this.responseService.success(order, 'Заказ найден');
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param() params: OrderIdDto,
    @Body() body: UpdateOrderStatusDto,
    @Request() req: AuthenticatedRequest
  ) {
    const order = await this.ordersService.updateOrderStatus(params.id, body.status, req.user.id);
    return this.responseService.success(order, 'Статус заказа обновлен');
  }

  @Put(':id/cancel')
  async cancelOrder(@Param() params: OrderIdDto, @Request() req: AuthenticatedRequest) {
    const order = await this.ordersService.cancelOrder(params.id, req.user.id);
    return this.responseService.success(order, 'Заказ отменен');
  }

  @Put(':id')
  async updateOrder(
    @Param() params: OrderIdDto,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: AuthenticatedRequest
  ) {
    const order = await this.ordersService.updateOrder(params.id, updateOrderDto, req.user.id);
    return this.responseService.success(order, 'Заказ обновлен');
  }
}
