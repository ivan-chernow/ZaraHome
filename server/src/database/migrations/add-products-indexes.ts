import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductsIndexes1700000000003 implements MigrationInterface {
  name = 'AddProductsIndexes1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем индексы для основных полей
    await queryRunner.query(`
      CREATE INDEX "IDX_products_category_id" ON "products" ("category_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_sub_category_id" ON "products" ("sub_category_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_type_id" ON "products" ("type_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_is_new" ON "products" ("isNew")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_is_available" ON "products" ("isAvailable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_discount" ON "products" ("discount")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_created_at" ON "products" ("createdAt" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_name_ru" ON "products" ("name_ru")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_name_eng" ON "products" ("name_eng")
    `);

    // Добавляем составные индексы для оптимизации фильтрации
    await queryRunner.query(`
      CREATE INDEX "IDX_products_category_available" ON "products" ("category_id", "isAvailable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_new_available" ON "products" ("isNew", "isAvailable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_discount_available" ON "products" ("discount", "isAvailable")
    `);

    // Добавляем индексы для поиска по тексту
    await queryRunner.query(`
      CREATE INDEX "IDX_products_name_ru_gin" ON "products" USING GIN (to_tsvector('russian', "name_ru"))
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_name_eng_gin" ON "products" USING GIN (to_tsvector('english', "name_eng"))
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_description_gin" ON "products" USING GIN (to_tsvector('russian', "description"))
    `);

    // Добавляем индекс для JSONB поля size для фильтрации по цене
    await queryRunner.query(`
      CREATE INDEX "IDX_products_size_gin" ON "products" USING GIN ("size")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы в обратном порядке
    await queryRunner.query(`DROP INDEX "IDX_products_size_gin"`);
    await queryRunner.query(`DROP INDEX "IDX_products_description_gin"`);
    await queryRunner.query(`DROP INDEX "IDX_products_name_eng_gin"`);
    await queryRunner.query(`DROP INDEX "IDX_products_name_ru_gin"`);
    await queryRunner.query(`DROP INDEX "IDX_products_discount_available"`);
    await queryRunner.query(`DROP INDEX "IDX_products_new_available"`);
    await queryRunner.query(`DROP INDEX "IDX_products_category_available"`);
    await queryRunner.query(`DROP INDEX "IDX_products_name_eng"`);
    await queryRunner.query(`DROP INDEX "IDX_products_name_ru"`);
    await queryRunner.query(`DROP INDEX "IDX_products_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_products_discount"`);
    await queryRunner.query(`DROP INDEX "IDX_products_is_available"`);
    await queryRunner.query(`DROP INDEX "IDX_products_is_new"`);
    await queryRunner.query(`DROP INDEX "IDX_products_type_id"`);
    await queryRunner.query(`DROP INDEX "IDX_products_sub_category_id"`);
    await queryRunner.query(`DROP INDEX "IDX_products_category_id"`);
  }
}
