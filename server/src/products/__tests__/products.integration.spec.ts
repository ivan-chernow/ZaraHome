import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products.module';
import { Product } from '../entity/products.entity';
import { Category } from '../entity/category.entity';
import { SubCategory } from '../entity/sub-category.entity';
import { Type } from '../entity/type.entity';
import { INestApplication } from '@nestjs/common';

describe.skip('Products (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product, Category, SubCategory, Type],
          synchronize: true,
          logging: false,
        }),
        ProductsModule,
      ],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('smoke: модуль поднимается', async () => {
    expect(app).toBeDefined();
  });

  // Здесь можно добавить реальные проверки репозитория/сервиса при необходимости
});


