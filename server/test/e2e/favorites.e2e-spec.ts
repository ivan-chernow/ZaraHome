import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Favorite } from '../../src/favorites/entity/favorite.entity';
import { User } from '../../src/users/user/entity/user.entity';
import { Product } from '../../src/products/entity/products.entity';

describe('Favorites (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Favorite, User, Product],
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

  describe('/favorites (GET)', () => {
    it('получение избранного без авторизации', () => {
      return request(app.getHttpServer())
        .get('/favorites')
        .expect(401);
    });
  });

  describe('/favorites (POST)', () => {
    it('добавление в избранное без авторизации', () => {
      return request(app.getHttpServer())
        .post('/favorites')
        .send({ productId: 1 })
        .expect(401);
    });
  });

  describe('/favorites/:productId (DELETE)', () => {
    it('удаление из избранного без авторизации', () => {
      return request(app.getHttpServer())
        .delete('/favorites/1')
        .expect(401);
    });
  });
});
