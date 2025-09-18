import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E: Auth flows', () => {
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

  it('POST /auth/login — 422/400 на невалидный body', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'bad', password: 'x' });
    expect([400, 422]).toContain(res.status);
  });

  it('POST /auth/refresh — 400 при отсутствии refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body?.success).toBe(false);
  });

  it('POST /auth/logout — 401 без JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .send({});
    expect(res.status).toBe(401);
  });
});


