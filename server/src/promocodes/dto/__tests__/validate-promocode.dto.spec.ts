import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidatePromocodeDto } from '../validate-promocode.dto';

const make = async (payload: Partial<ValidatePromocodeDto>) => {
  const dto = plainToInstance(ValidatePromocodeDto, payload);
  const errors = await validate(dto);
  return { dto, errors };
};

describe('ValidatePromocodeDto', () => {
  it('валидно при корректных данных', async () => {
    const { errors, dto } = await make({
      code: 'SALE10',
      orderAmount: 1000,
      userId: 5,
    });
    expect(errors.length).toBe(0);
    expect(dto.orderAmount).toBe(1000);
    expect(dto.userId).toBe(5);
  });

  it('конвертирует строковые числа', async () => {
    const { errors, dto } = await make({
      code: 'SALE10',
      orderAmount: '1500' as any,
      userId: '3' as any,
    });
    expect(errors.length).toBe(0);
    expect(dto.orderAmount).toBe(1500);
    expect(dto.userId).toBe(3);
  });

  it.each([
    { code: 123 as any, orderAmount: 100 },
    { code: '', orderAmount: 100 },
    { code: 'OK', orderAmount: 0 },
    { code: 'OK', orderAmount: -10 },
    { code: 'OK', orderAmount: 'NaN' as any },
    { code: 'OK', orderAmount: 100, userId: 'NaN' as any },
  ])('некорректные данные: %j', async (payload: any) => {
    const { errors } = await make(payload);
    expect(errors.length).toBeGreaterThan(0);
  });
});
