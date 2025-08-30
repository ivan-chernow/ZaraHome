import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationIndexes1700000000002 implements MigrationInterface {
  name = 'AddEmailVerificationIndexes1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем индекс для поиска по email и статусу верификации
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_email_verified" ON "email_verification" ("email", "isVerified")
    `);

    // Добавляем индекс для поиска по токену
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_token" ON "email_verification" ("token")
    `);

    // Добавляем индекс для поиска по коду
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_code" ON "email_verification" ("code")
    `);

    // Добавляем индекс для поиска по дате истечения
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_expires_at" ON "email_verification" ("expiresAt")
    `);

    // Добавляем составной индекс для активных верификаций
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_email_expires" ON "email_verification" ("email", "expiresAt")
    `);

    // Добавляем индекс для сортировки по дате создания
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_created_at" ON "email_verification" ("createdAt" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы в обратном порядке
    await queryRunner.query(`DROP INDEX "IDX_email_verification_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_email_expires"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_expires_at"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_code"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_token"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_email_verified"`);
  }
}
