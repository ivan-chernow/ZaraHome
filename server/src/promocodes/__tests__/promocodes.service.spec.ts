import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PromocodesService } from '../promocodes.service';

type Mock<T> = { [K in keyof T]: jest.Mock<any, any> };

describe('PromocodesService (unit)', () => {
  let service: PromocodesService;
  let repo: Mock<any>;
  let cache: Mock<any>;

  beforeEach(() => {
    repo = {
      findByCode: jest.fn(),
      findActiveByCode: jest.fn(),
      createPromocode: jest.fn(),
      updatePromocode: jest.fn(),
      deactivateByCode: jest.fn(),
      findAllActivePaginated: jest.fn(),
      findAllPaginated: jest.fn(),
      searchPromocodes: jest.fn(),
      getPromocodeStats: jest.fn(),
    } as any;
    cache = {
      getOrSet: jest.fn((key: string, fn: () => any) => fn()),
      deleteByPrefix: jest.fn(),
    } as any;
    service = new PromocodesService(repo as any, cache as any);
  });

  describe('create', () => {
    it('ошибка при дублировании кода', async () => {
      repo.findByCode.mockResolvedValue({ code: 'TEST' });
      await expect(service.create('TEST', 10)).rejects.toBeInstanceOf(ConflictException);
    });

    it('успех: создаёт и инвалидирует кеш', async () => {
      repo.findByCode.mockResolvedValue(null);
      repo.createPromocode.mockResolvedValue({ code: 'TEST', discount: 10 });
      await service.create('TEST', 10, { maxUsage: 10 });
      expect(repo.createPromocode).toHaveBeenCalled();
    });
  });

  describe('validateAndApply', () => {
    it('некорректные входные', async () => {
      expect(await service.validateAndApply('', 100)).toEqual({ isValid: false, message: expect.any(String) });
      expect(await service.validateAndApply('A', 0)).toEqual({ isValid: false, message: expect.any(String) });
    });

    it('ошибки условий: не найден, просрочен, minOrderAmount, usage, >100%', async () => {
      repo.findActiveByCode.mockResolvedValue(null);
      expect((await service.validateAndApply('A', 100)).isValid).toBe(false);

      repo.findActiveByCode.mockResolvedValue({ expiresAt: new Date(Date.now() - 1000) });
      expect((await service.validateAndApply('A', 100)).isValid).toBe(false);

      repo.findActiveByCode.mockResolvedValue({ minOrderAmount: 200 });
      expect((await service.validateAndApply('A', 100)).isValid).toBe(false);

      repo.findActiveByCode.mockResolvedValue({ maxUsage: 1, currentUsage: 1 });
      expect((await service.validateAndApply('A', 100)).isValid).toBe(false);

      repo.findActiveByCode.mockResolvedValue({ discount: 150 });
      expect((await service.validateAndApply('A', 100)).isValid).toBe(false);
    });

    it('успех: корректный расчёт скидки', async () => {
      repo.findActiveByCode.mockResolvedValue({ discount: 10 });
      const res = await service.validateAndApply('A', 200);
      expect(res.isValid).toBe(true);
      expect(res.discount).toBe(20);
      expect(res.finalAmount).toBe(180);
    });
  });

  describe('update/deactivate', () => {
    it('update: 404 если не найден', async () => {
      repo.findByCode.mockResolvedValue(null);
      await expect(service.update('A', { discount: 10 })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('update: валидация discount/maxUsage', async () => {
      repo.findByCode.mockResolvedValue({ code: 'A', currentUsage: 0 });
      await expect(service.update('A', { discount: 0 })).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.update('A', { maxUsage: 0 })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deactivate: 404 если не найден', async () => {
      repo.findByCode.mockResolvedValue(null);
      await expect(service.deactivate('A')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});



