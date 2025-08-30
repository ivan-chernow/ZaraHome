import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartIndexes1700000000000 implements MigrationInterface {
  name = 'AddCartIndexes1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем уникальный составной индекс для предотвращения дублирования
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_cart_user_product" ON "cart" ("user_id", "product_id")
    `);

    // Добавляем индекс для быстрого поиска по пользователю
    await queryRunner.query(`
      CREATE INDEX "IDX_cart_user_id" ON "cart" ("user_id")
    `);

    // Добавляем индекс для быстрого поиска по продукту
    await queryRunner.query(`
      CREATE INDEX "IDX_cart_product_id" ON "cart" ("product_id")
    `);

    // Добавляем индекс для сортировки по дате создания
    await queryRunner.query(`
      CREATE INDEX "IDX_cart_created_at" ON "cart" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы в обратном порядке
    await queryRunner.query(`DROP INDEX "IDX_cart_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_cart_product_id"`);
    await queryRunner.query(`DROP INDEX "IDX_cart_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_cart_user_product"`);
  }
}
