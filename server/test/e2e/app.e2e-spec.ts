import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E: Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login -> 422 при невалидном body', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'bad', password: 'x' });
    expect([400, 422]).toContain(res.status);
  });
});


