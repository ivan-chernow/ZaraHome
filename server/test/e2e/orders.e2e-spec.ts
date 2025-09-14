import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Order } from '../../src/orders/entity/order.entity';
import { User } from '../../src/users/user/entity/user.entity';

describe('Orders (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Order, User],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/orders (GET)', () => {
    it('получение заказов без авторизации', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });
  });

  describe('/orders (POST)', () => {
    it('создание заказа без авторизации', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({ items: [], total: 100 })
        .expect(401);
    });
  });

  describe('/orders/:id (PUT)', () => {
    it('обновление заказа без авторизации', () => {
      return request(app.getHttpServer())
        .put('/orders/1')
        .send({ status: 'shipped' })
        .expect(401);
    });
  });
});
