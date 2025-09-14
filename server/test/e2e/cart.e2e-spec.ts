import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Cart } from '../../src/cart/entity/cart.entity';
import { Product } from '../../src/products/entity/products.entity';
import { User } from '../../src/users/user/entity/user.entity';

describe('Cart (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Cart, Product, User],
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

  describe('/cart (GET)', () => {
    it('получение корзины без авторизации', () => {
      return request(app.getHttpServer())
        .get('/cart')
        .expect(401);
    });
  });

  describe('/cart (POST)', () => {
    it('добавление товара в корзину без авторизации', () => {
      return request(app.getHttpServer())
        .post('/cart')
        .send({ productId: 1, quantity: 1 })
        .expect(401);
    });
  });

  describe('/cart (DELETE)', () => {
    it('очистка корзины без авторизации', () => {
      return request(app.getHttpServer())
        .delete('/cart')
        .expect(401);
    });
  });
});
