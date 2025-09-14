import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/users/user/entity/user.entity';
import { DeliveryAddress } from '../../src/users/user/entity/delivery-address.entity';

describe('User Profile (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, DeliveryAddress],
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

  describe('/user/profile (GET)', () => {
    it('получение профиля без авторизации', () => {
      return request(app.getHttpServer())
        .get('/user/profile')
        .expect(401);
    });
  });

  describe('/user/change-password (PATCH)', () => {
    it('изменение пароля без авторизации', () => {
      return request(app.getHttpServer())
        .patch('/user/change-password')
        .send({ currentPassword: 'old', newPassword: 'new' })
        .expect(401);
    });
  });

  describe('/user/change-email (PATCH)', () => {
    it('изменение email без авторизации', () => {
      return request(app.getHttpServer())
        .patch('/user/change-email')
        .send({ newEmail: 'new@test.com' })
        .expect(401);
    });
  });

  describe('/user/delivery-addresses (GET)', () => {
    it('получение адресов доставки без авторизации', () => {
      return request(app.getHttpServer())
        .get('/user/delivery-addresses')
        .expect(401);
    });
  });

  describe('/user/delivery-addresses (POST)', () => {
    it('добавление адреса доставки без авторизации', () => {
      return request(app.getHttpServer())
        .post('/user/delivery-addresses')
        .send({ firstName: 'John', lastName: 'Doe' })
        .expect(401);
    });
  });
});
