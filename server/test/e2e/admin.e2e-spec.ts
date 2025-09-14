import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/users/user/entity/user.entity';
import { Product } from '../../src/products/entity/products.entity';

describe('Admin (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Product],
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

  describe('/admin (GET)', () => {
    it('доступ к админке без авторизации', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .expect(401);
    });
  });

  describe('/admin/products (GET)', () => {
    it('получение товаров админом без авторизации', () => {
      return request(app.getHttpServer())
        .get('/admin/products')
        .expect(401);
    });
  });

  describe('/admin/users (GET)', () => {
    it('получение пользователей админом без авторизации', () => {
      return request(app.getHttpServer())
        .get('/admin/users')
        .expect(401);
    });
  });

  describe('/admin/orders (GET)', () => {
    it('получение заказов админом без авторизации', () => {
      return request(app.getHttpServer())
        .get('/admin/orders')
        .expect(401);
    });
  });
});
