import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth E2E (smoke)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    // Включаем cookies
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login -> 401 при неверных данных', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'none@example.com', password: 'bad' })
      .expect(res => {
        expect([400, 401]).toContain(res.status);
      });
  });

  it('POST /auth/refresh -> 400 без refresh токена', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({})
      .expect(400);
  });
});


