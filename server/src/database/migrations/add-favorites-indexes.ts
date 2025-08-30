import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavoritesIndexes1700000000001 implements MigrationInterface {
  name = 'AddFavoritesIndexes1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем уникальный составной индекс для предотвращения дублирования
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_favorites_user_product" ON "favorites" ("user_id", "product_id")
    `);

    // Добавляем индекс для быстрого поиска по пользователю
    await queryRunner.query(`
      CREATE INDEX "IDX_favorites_user_id" ON "favorites" ("user_id")
    `);

    // Добавляем индекс для быстрого поиска по продукту
    await queryRunner.query(`
      CREATE INDEX "IDX_favorites_product_id" ON "favorites" ("product_id")
    `);

    // Добавляем индекс для сортировки по дате создания
    await queryRunner.query(`
      CREATE INDEX "IDX_favorites_created_at" ON "favorites" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы в обратном порядке
    await queryRunner.query(`DROP INDEX "IDX_favorites_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_favorites_product_id"`);
    await queryRunner.query(`DROP INDEX "IDX_favorites_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_favorites_user_product"`);
  }
}
