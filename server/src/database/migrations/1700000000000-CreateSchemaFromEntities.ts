import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemaFromEntities1700000000000 implements MigrationInterface {
  name = 'CreateSchemaFromEntities1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Создаём enum типы
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'ADMIN')
    `);
    
    await queryRunner.query(`
      CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')
    `);

    // Создаём таблицу users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR UNIQUE NOT NULL,
        "password" VARCHAR NOT NULL,
        "role" "public"."user_role_enum" DEFAULT 'USER',
        "isEmailVerified" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Создаём таблицу categories
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL
      )
    `);

    // Создаём таблицу sub_categories
    await queryRunner.query(`
      CREATE TABLE "sub_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "categoryId" INTEGER NOT NULL
      )
    `);

    // Создаём таблицу types
    await queryRunner.query(`
      CREATE TABLE "types" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "subCategoryId" INTEGER NOT NULL
      )
    `);

    // Создаём таблицу products
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL PRIMARY KEY,
        "name_eng" VARCHAR NOT NULL,
        "name_ru" VARCHAR NOT NULL,
        "img" TEXT[] NOT NULL,
        "colors" JSONB NOT NULL,
        "size" JSONB NOT NULL,
        "deliveryDate" VARCHAR NOT NULL,
        "description" TEXT NOT NULL,
        "isNew" BOOLEAN DEFAULT false,
        "discount" INTEGER,
        "isAvailable" BOOLEAN DEFAULT true,
        "category_id" INTEGER,
        "sub_category_id" INTEGER,
        "type_id" INTEGER,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Создаём таблицу orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "items" JSONB NOT NULL,
        "totalPrice" DECIMAL(10,2) NOT NULL,
        "totalCount" INTEGER NOT NULL,
        "status" "public"."order_status_enum" DEFAULT 'PENDING',
        "address" VARCHAR,
        "phone" VARCHAR,
        "comment" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Создаём таблицу cart
    await queryRunner.query(`
      CREATE TABLE "cart" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "product_id" INTEGER NOT NULL
      )
    `);

    // Создаём таблицу favorites
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "product_id" INTEGER NOT NULL
      )
    `);

    // Создаём таблицу promocodes
    await queryRunner.query(`
      CREATE TABLE "promocodes" (
        "id" SERIAL PRIMARY KEY,
        "code" VARCHAR UNIQUE NOT NULL,
        "discount" INTEGER NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Создаём таблицу refresh_tokens
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" SERIAL PRIMARY KEY,
        "token" VARCHAR NOT NULL,
        "user_id" INTEGER NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL
      )
    `);

    // Создаём таблицу email_verifications
    await queryRunner.query(`
      CREATE TABLE "email_verifications" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR NOT NULL,
        "code" VARCHAR NOT NULL,
        "token" VARCHAR NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now(),
        "isVerified" BOOLEAN DEFAULT false
      )
    `);

    // Создаём таблицу delivery_addresses
    await queryRunner.query(`
      CREATE TABLE "delivery_addresses" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "region" VARCHAR NOT NULL,
        "city" VARCHAR NOT NULL,
        "street" VARCHAR NOT NULL,
        "house" VARCHAR NOT NULL,
        "apartment" VARCHAR,
        "postalCode" VARCHAR NOT NULL,
        "isDefault" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Создаём внешние ключи
    await queryRunner.query(`
      ALTER TABLE "sub_categories" 
      ADD CONSTRAINT "FK_sub_categories_category" 
      FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "types" 
      ADD CONSTRAINT "FK_types_sub_category" 
      FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD CONSTRAINT "FK_products_category" 
      FOREIGN KEY ("category_id") REFERENCES "categories"("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD CONSTRAINT "FK_products_sub_category" 
      FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD CONSTRAINT "FK_products_type" 
      FOREIGN KEY ("type_id") REFERENCES "types"("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "cart" 
      ADD CONSTRAINT "FK_cart_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "cart" 
      ADD CONSTRAINT "FK_cart_product" 
      FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "favorites" 
      ADD CONSTRAINT "FK_favorites_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "favorites" 
      ADD CONSTRAINT "FK_favorites_product" 
      FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_addresses" 
      ADD CONSTRAINT "FK_delivery_addresses_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    // Создаём индексы для производительности
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_category" ON "products" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_sub_category" ON "products" ("sub_category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_user_status" ON "orders" ("user_id", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_cart_user_product" ON "cart" ("user_id", "product_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_favorites_user_product" ON "favorites" ("user_id", "product_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_promocodes_code" ON "promocodes" ("code")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_products_category"`);
    await queryRunner.query(`DROP INDEX "IDX_products_sub_category"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_user_status"`);
    await queryRunner.query(`DROP INDEX "IDX_cart_user_product"`);
    await queryRunner.query(`DROP INDEX "IDX_favorites_user_product"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_code"`);

    // Удаляем внешние ключи
    await queryRunner.query(`ALTER TABLE "delivery_addresses" DROP CONSTRAINT "FK_delivery_addresses_user"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_product"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_user"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_product"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_user"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_type"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_sub_category"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_category"`);
    await queryRunner.query(`ALTER TABLE "types" DROP CONSTRAINT "FK_types_sub_category"`);
    await queryRunner.query(`ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_sub_categories_category"`);

    // Удаляем таблицы в обратном порядке
    await queryRunner.query(`DROP TABLE "delivery_addresses"`);
    await queryRunner.query(`DROP TABLE "email_verifications"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "promocodes"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "types"`);
    await queryRunner.query(`DROP TABLE "sub_categories"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Удаляем enum типы
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
