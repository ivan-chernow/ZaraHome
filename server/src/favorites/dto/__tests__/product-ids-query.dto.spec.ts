import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductIdsQueryDto } from '../product-ids-query.dto';

const toDto = async (value: any) => {
  const dto = plainToInstance(ProductIdsQueryDto, { productIds: value });
  const errors = await validate(dto);
  return { dto, errors };
};

describe('ProductIdsQueryDto', () => {
  it.each([
    { input: undefined, expected: [] },
    { input: null, expected: [] },
    { input: '', expected: [] },
    { input: '1', expected: [1] },
    { input: '1,2,3', expected: [1, 2, 3] },
    { input: ' 1 , 2 , 3 ', expected: [1, 2, 3] },
    { input: '1,1,2,2,3', expected: [1, 2, 3] },
    { input: 'a,1,b,2,0,-1,3', expected: [1, 2, 3] },
  ])(
    'парсит строку "$input" в массив $expected',
    async ({ input, expected }) => {
      const { dto, errors } = await toDto(input as any);
      expect(errors.length).toBe(0);
      expect(dto.productIds).toEqual(expected);
    }
  );

  it('фейлится при слишком длинном списке (>50)', async () => {
    const arr = Array.from({ length: 51 }, (_, i) => i + 1).join(',');
    const { errors } = await toDto(arr);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('гибко обрабатывает нестроковое значение (каст к строке)', async () => {
    const { errors, dto } = await toDto(123 as any);
    expect(errors.length).toBe(0);
    expect(dto.productIds).toEqual([123]);
  });
});
