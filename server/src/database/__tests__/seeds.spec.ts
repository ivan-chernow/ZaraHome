import { DatabaseSeeder } from '../seeds/index';

describe('DatabaseSeeder (unit)', () => {
  it('run: вызывает последовательность сидов (smoke)', async () => {
    const ds: any = {};
    const seeder = new DatabaseSeeder(ds);
    const runCategoriesSeed = jest
      .spyOn<any, any>(seeder as any, 'runCategoriesSeed')
      .mockResolvedValue(undefined);
    const runSubCategoriesSeed = jest
      .spyOn<any, any>(seeder as any, 'runSubCategoriesSeed')
      .mockResolvedValue([]);
    const runTypesSeed = jest
      .spyOn<any, any>(seeder as any, 'runTypesSeed')
      .mockResolvedValue(undefined);
    const runPromocodesSeed = jest
      .spyOn<any, any>(seeder as any, 'runPromocodesSeed')
      .mockResolvedValue(undefined);

    await seeder.run();

    expect(runCategoriesSeed).toHaveBeenCalled();
    expect(runSubCategoriesSeed).toHaveBeenCalled();
    expect(runTypesSeed).toHaveBeenCalled();
    expect(runPromocodesSeed).toHaveBeenCalled();
  });
});
