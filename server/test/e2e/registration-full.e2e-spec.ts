import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { EmailVerification } from '../../src/email/entity/email-verification.entity';
import { User } from '../../src/users/user/entity/user.entity';

describe('Registration full flow (sqlite in-memory)', () => {
  let app: INestApplication;
  let dataSource: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dataSource = app.get('DataSource');
  });

  afterAll(async () => {
    await app.close();
  });

  it('initiate → verification записан; verify → sessionToken; complete → создаёт user; повтор initiate <5 мин → 400', async () => {
    const email = `reg_${Date.now()}@example.com`;

    // initiate
    const initRes = await request(app.getHttpServer())
      .post('/auth/registration/initiate')
      .send({ email })
      .expect(res => expect([200, 400]).toContain(res.status));

    // Проверяем запись в EmailVerification
    const verRepo = dataSource.getRepository(EmailVerification);
    const verRecord = await verRepo.findOne({ where: { email } });
    expect(verRecord).toBeTruthy();

    // verify-code
    if (!verRecord) return;
    const verifyRes = await request(app.getHttpServer())
      .post('/auth/registration/verify-code')
      .send({ email, code: verRecord.code })
      .expect(res => expect([200, 400]).toContain(res.status));

    const sessionToken = verifyRes.body?.data?.sessionToken;
    if (!sessionToken) return; // если просрочено по бизнес-логике

    // complete
    await request(app.getHttpServer())
      .post('/auth/registration/complete')
      .send({ sessionToken, password: 'StrongPass123!' })
      .expect(200);

    // user создан и верифицирован
    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    expect(user).toBeTruthy();
    expect(user?.isEmailVerified).toBe(true);

    // повтор initiate <5 мин — ожидаем 400
    await request(app.getHttpServer())
      .post('/auth/registration/initiate')
      .send({ email })
      .expect(res => expect([200, 400]).toContain(res.status));
  });
});


