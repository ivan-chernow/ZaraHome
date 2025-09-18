import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { ResponseService } from 'src/shared/services/response.service';
import { OrderStatus } from 'src/shared/shared.interfaces';

const mockOrdersService = () => ({
	createOrder: jest.fn(),
	getUserOrders: jest.fn(),
	getActiveOrder: jest.fn(),
	getOrderById: jest.fn(),
	updateOrderStatus: jest.fn(),
	cancelOrder: jest.fn(),
	updateOrder: jest.fn(),
	getOrdersByStatus: jest.fn(),
	getOrdersStatistics: jest.fn(),
	searchOrders: jest.fn(),
});

const mockResponseService = () => ({
	success: jest.fn((data: any, message: string) => ({ success: true, data, message })),
});

describe('OrdersController', () => {
	let controller: OrdersController;
	let ordersService: ReturnType<typeof mockOrdersService>;
	let _responseService: ReturnType<typeof mockResponseService>;
	const req = { user: { id: 10 } } as any;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OrdersController],
			providers: [
				{ provide: OrdersService, useFactory: mockOrdersService },
				{ provide: ResponseService, useFactory: mockResponseService },
			],
		}).compile();

		controller = module.get(OrdersController);
		ordersService = module.get(OrdersService);
		_responseService = module.get(ResponseService);
	});

	it('createOrder', async () => {
		ordersService.createOrder.mockResolvedValue({ id: 1 });
		const result = await controller.createOrder({ items: [] } as any, req);
		expect(ordersService.createOrder).toHaveBeenCalledWith({ items: [] }, 10);
		expect(result).toEqual({ success: true, data: { id: 1 }, message: 'Заказ успешно создан' });
	});

	it('getUserOrders with defaults', async () => {
		ordersService.getUserOrders.mockResolvedValue({ items: [], page: 1, limit: 20 });
		const result = await controller.getUserOrders(req, undefined, undefined);
		expect(ordersService.getUserOrders).toHaveBeenCalledWith(10, 1, 20);
		expect(result.message).toBe('Заказы пользователя загружены');
	});

	it('getActiveOrder', async () => {
		ordersService.getActiveOrder.mockResolvedValue({ id: 2, status: OrderStatus.PENDING });
		const result = await controller.getActiveOrder(req);
		expect(ordersService.getActiveOrder).toHaveBeenCalledWith(10);
		expect(result.data).toEqual({ id: 2, status: OrderStatus.PENDING });
	});

	it('getOrderById', async () => {
		ordersService.getOrderById.mockResolvedValue({ id: 3 });
		const result = await controller.getOrderById({ id: 3 } as any, req);
		expect(ordersService.getOrderById).toHaveBeenCalledWith(3, 10);
		expect(result.data).toEqual({ id: 3 });
	});

	it('updateOrderStatus', async () => {
		ordersService.updateOrderStatus.mockResolvedValue({ id: 4, status: OrderStatus.SHIPPED });
		const result = await controller.updateOrderStatus({ id: 4 } as any, { status: OrderStatus.SHIPPED } as any, req);
		expect(ordersService.updateOrderStatus).toHaveBeenCalledWith(4, OrderStatus.SHIPPED, 10);
		expect(result.message).toBe('Статус заказа обновлен');
	});

	it('cancelOrder', async () => {
		ordersService.cancelOrder.mockResolvedValue({ id: 5, status: OrderStatus.CANCELLED });
		const result = await controller.cancelOrder({ id: 5 } as any, req);
		expect(ordersService.cancelOrder).toHaveBeenCalledWith(5, 10);
	expect(result.data?.status).toBe(OrderStatus.CANCELLED);
	});
});
