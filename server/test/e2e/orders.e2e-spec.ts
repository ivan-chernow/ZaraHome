import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E: Orders (basic guards)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /orders/my — 401 без JWT', async () => {
    const res = await request(app.getHttpServer()).get('/orders/my');
    expect(res.status).toBe(401);
  });

  it('POST /orders — 401 без JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [] });
    expect(res.status).toBe(401);
  });
});


