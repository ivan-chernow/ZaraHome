import { CacheService } from '../cache.service';

describe('CacheService (unit)', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService();
  });

  it('getOrSet: кэширует и возвращает из кеша', async () => {
    let calls = 0;
    const value1 = await cache.getOrSet(
      'k',
      async () => {
        calls++;
        return 42;
      },
      { ttl: 1, prefix: 'p' }
    );
    const value2 = await cache.getOrSet(
      'k',
      async () => {
        calls++;
        return 99;
      },
      { ttl: 1, prefix: 'p' }
    );
    expect(value1).toBe(42);
    expect(value2).toBe(42);
    expect(calls).toBe(1);
  });

  it('deleteByPrefix: удаляет ключи', async () => {
    await cache.set('a', 1, { prefix: 'x' });
    await cache.set('b', 2, { prefix: 'x' });
    await cache.deleteByPrefix('x');
    expect(await cache.get('a', 'x')).toBeNull();
    expect(await cache.get('b', 'x')).toBeNull();
  });
});
