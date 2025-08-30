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

    // Создаем таблицу для отслеживания использования промокодов
    await queryRunner.query(`
      CREATE TABLE "promocode_usage" (
        "id" SERIAL PRIMARY KEY,
        "promocode_id" INTEGER NOT NULL,
        "user_id" INTEGER NOT NULL,
        "order_amount" DECIMAL(10,2) NOT NULL,
        "discount_applied" DECIMAL(10,2) NOT NULL,
        "used_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
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

    // Добавляем индексы для таблицы promocode_usage
    await queryRunner.query(`
      CREATE INDEX "IDX_promocode_usage_promocode_id" ON "promocode_usage" ("promocode_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocode_usage_user_id" ON "promocode_usage" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocode_usage_used_at" ON "promocode_usage" ("used_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocode_usage_promocode_user" ON "promocode_usage" ("promocode_id", "user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_promocode_usage_promocode_date" ON "promocode_usage" ("promocode_id", "used_at")
    `);

    // Добавляем внешний ключ для promocode_usage
    await queryRunner.query(`
      ALTER TABLE "promocode_usage" 
      ADD CONSTRAINT "FK_promocode_usage_promocode" 
      FOREIGN KEY ("promocode_id") REFERENCES "promocodes"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем внешний ключ
    await queryRunner.query(`
      ALTER TABLE "promocode_usage" DROP CONSTRAINT "FK_promocode_usage_promocode"
    `);

    // Удаляем индексы promocode_usage
    await queryRunner.query(`DROP INDEX "IDX_promocode_usage_promocode_date"`);
    await queryRunner.query(`DROP INDEX "IDX_promocode_usage_promocode_user"`);
    await queryRunner.query(`DROP INDEX "IDX_promocode_usage_used_at"`);
    await queryRunner.query(`DROP INDEX "IDX_promocode_usage_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_promocode_usage_promocode_id"`);

    // Удаляем индексы promocodes
    await queryRunner.query(`DROP INDEX "IDX_promocodes_active_discount"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_active_expires"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_expires_at"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_discount"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_is_active"`);
    await queryRunner.query(`DROP INDEX "IDX_promocodes_code"`);

    // Удаляем таблицу promocode_usage
    await queryRunner.query(`DROP TABLE "promocode_usage"`);

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
