import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPromocodesOptimizations1700000000004 implements MigrationInterface {
  name = 'AddPromocodesOptimizations1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем новые поля в таблицу promocodes
    await queryRunner.query(`
      ALTER TABLE "promocodes" 
      ADD COLUMN "max_usage" INTEGER,
      ADD COLUMN "current_usage" INTEGER DEFAULT 0,
      ADD COLUMN "min_order_amount" DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN "expires_at" TIMESTAMP,
      ADD COLUMN "description" TEXT,
      ADD COLUMN "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // Добавляем индексы для таблицы promocodes
    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_code" ON "promocodes" ("code")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_is_active" ON "promocodes" ("isActive")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_discount" ON "promocodes" ("discount")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_created_at" ON "promocodes" ("createdAt" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_expires_at" ON "promocodes" ("expiresAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_active_expires" ON "promocodes" ("isActive", "expiresAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocodes_active_discount" ON "promocodes" ("isActive", "discount")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы promocodes
    await queryRunner.query(`DROP INDEX "IDX_promocodes_active_discount"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_active_expires"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_expires_at"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_discount"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_is_active"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_code"`);

    // Удаляем новые поля из таблицы promocodes
    await queryRunner.query(`
      ALTER TABLE "promocodes" 
      DROP COLUMN "max_usage",
      DROP COLUMN "current_usage",
      DROP COLUMN "min_order_amount",
      DROP COLUMN "expires_at",
      DROP COLUMN "description",
      DROP COLUMN "updated_at"
    `);
  }
}