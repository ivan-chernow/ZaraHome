import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { ResponseService } from 'src/shared/services/response.service';
import { PRODUCTS_CONSTANTS } from '../products.constants';
import { ResourceNotFoundException } from 'src/shared/shared.interfaces';

const mockProductsService = () => ({
	findAll: jest.fn(),
	searchProducts: jest.fn(),
	getCatalog: jest.fn(),
	findOne: jest.fn(),
});

const mockResponseService = () => ({
	success: jest.fn((data: any, message: string) => ({ data, message, success: true })),
});

describe('ProductsController', () => {
	let controller: ProductsController;
	let productsService: ReturnType<typeof mockProductsService>;
	let responseService: ReturnType<typeof mockResponseService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{ provide: ProductsService, useFactory: mockProductsService },
				{ provide: ResponseService, useFactory: mockResponseService },
			],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
		productsService = module.get(ProductsService);
		responseService = module.get(ResponseService);
	});

	describe('findAll', () => {
		it('возвращает пагинированный список с фильтрами и сортировкой', async () => {
			const query = { page: 2, limit: 10, categoryId: 1, sortField: 'price', sortOrder: 'ASC' } as any;
			const serviceResult = {
				products: [{ id: 1 }],
				total: 1,
				page: 2,
				limit: 10,
				totalPages: 1,
				hasNext: false,
				hasPrev: true,
			};
			productsService.findAll.mockResolvedValue(serviceResult);

			const result = await controller.findAll(query);

			expect(productsService.findAll).toHaveBeenCalledWith(
				{ categoryId: 1, subCategoryId: undefined, typeId: undefined, minPrice: undefined, maxPrice: undefined, isNew: undefined, hasDiscount: undefined, isAvailable: undefined, search: undefined },
				{ field: 'price', order: 'ASC' },
				{ page: 2, limit: 10 }
			);
			expect(responseService.success).toHaveBeenCalledWith(serviceResult, PRODUCTS_CONSTANTS.SUCCESS.PRODUCTS_LOADED);
			expect(result).toEqual({ data: serviceResult, message: PRODUCTS_CONSTANTS.SUCCESS.PRODUCTS_LOADED, success: true });
		});

		it('использует дефолтные значения пагинации при отсутствии page/limit', async () => {
			const query = {} as any;
			const serviceResult = { products: [], total: 0, page: 1, limit: PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE, totalPages: 0, hasNext: false, hasPrev: false };
			productsService.findAll.mockResolvedValue(serviceResult);

			const result = await controller.findAll(query);

			expect(productsService.findAll).toHaveBeenCalledWith(
				{ categoryId: undefined, subCategoryId: undefined, typeId: undefined, minPrice: undefined, maxPrice: undefined, isNew: undefined, hasDiscount: undefined, isAvailable: undefined, search: undefined },
				undefined,
				{ page: 1, limit: PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE }
			);
			expect(result).toEqual({ data: serviceResult, message: PRODUCTS_CONSTANTS.SUCCESS.PRODUCTS_LOADED, success: true });
		});
	});

	describe('searchProducts', () => {
		it('возвращает найденные продукты', async () => {
			const items = [{ id: 1 }, { id: 2 }];
			productsService.searchProducts.mockResolvedValue(items);
			const result = await controller.searchProducts('chair', 5);
			expect(productsService.searchProducts).toHaveBeenCalledWith('chair', 5);
			expect(result).toEqual({ data: items, message: PRODUCTS_CONSTANTS.SUCCESS.SEARCH_COMPLETED, success: true });
		});
	});

	describe('findOne', () => {
		it('возвращает продукт если найден', async () => {
			productsService.findOne = jest.fn().mockResolvedValue({ id: 5 });
			const result = await controller.findOne({ id: 5 } as any);
			expect(result.data).toEqual({ id: 5 });
		});

		it('бросает ResourceNotFoundException если не найден', async () => {
			productsService.findOne = jest.fn().mockResolvedValue(undefined);
			await expect(controller.findOne({ id: 1 } as any)).rejects.toBeInstanceOf(ResourceNotFoundException);
		});
	});
});
