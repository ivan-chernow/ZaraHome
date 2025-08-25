import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { ResponseService } from 'src/shared/services/response.service';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: AuthenticatedRequest) {
    try {
      const order = await this.ordersService.createOrder(createOrderDto, req.user.id);
      return this.responseService.success(order, 'Заказ успешно создан');
    } catch (error) {
      return this.responseService.error('Ошибка при создании заказа', error.message);
    }
  }

  @Get('my')
  async getUserOrders(@Request() req: AuthenticatedRequest) {
    try {
      const orders = await this.ordersService.getUserOrders(req.user.id);
      return this.responseService.success(orders, 'Заказы пользователя загружены');
    } catch (error) {
      return this.responseService.error('Ошибка при загрузке заказов', error.message);
    }
  }

  @Get('active')
  async getActiveOrder(@Request() req: AuthenticatedRequest) {
    try {
      const order = await this.ordersService.getActiveOrder(req.user.id);
      return this.responseService.success(order, 'Активный заказ загружен');
    } catch (error) {
      return this.responseService.error('Ошибка при загрузке активного заказа', error.message);
    }
  }

  @Get(':id')
  async getOrderById(@Param() params: OrderIdDto, @Request() req: AuthenticatedRequest) {
    try {
      const order = await this.ordersService.getOrderById(params.id, req.user.id);
      return this.responseService.success(order, 'Заказ найден');
    } catch (error) {
      return this.responseService.error('Ошибка при поиске заказа', error.message);
    }
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param() params: OrderIdDto,
    @Body('status') status: OrderStatus,
    @Request() req: AuthenticatedRequest
  ) {
    try {
      const order = await this.ordersService.updateOrderStatus(params.id, status, req.user.id);
      return this.responseService.success(order, 'Статус заказа обновлен');
    } catch (error) {
      return this.responseService.error('Ошибка при обновлении статуса заказа', error.message);
    }
  }

  @Put(':id/cancel')
  async cancelOrder(@Param() params: OrderIdDto, @Request() req: AuthenticatedRequest) {
    try {
      const order = await this.ordersService.cancelOrder(params.id, req.user.id);
      return this.responseService.success(order, 'Заказ отменен');
    } catch (error) {
      return this.responseService.error('Ошибка при отмене заказа', error.message);
    }
  }

  @Put(':id')
  async updateOrder(
    @Param() params: OrderIdDto,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: AuthenticatedRequest
  ) {
    try {
      const order = await this.ordersService.updateOrder(params.id, updateOrderDto, req.user.id);
      return this.responseService.success(order, 'Заказ обновлен');
    } catch (error) {
      return this.responseService.error('Ошибка при обновлении заказа', error.message);
    }
  }
}
