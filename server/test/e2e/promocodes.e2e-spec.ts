import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';

describe('Promocodes E2E (smoke)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /promocodes/apply -> валидирует вход и отдаёт isValid=false для некорректных', async () => {
    const res = await request(app.getHttpServer())
      .post('/promocodes/apply')
      .send({ code: '', orderAmount: 0 })
      .expect(201);
    expect(res.body?.data?.isValid).toBe(false);
  });
});


