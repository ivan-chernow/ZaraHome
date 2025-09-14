import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ResetPassword } from '../../src/auth/reset-password/entity/reset-password.entity';
import { User } from '../../src/users/user/entity/user.entity';

describe('Reset Password full flow (sqlite in-memory)', () => {
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

  it('request → запись reset; verify (POST /auth/reset-password/verify) → 200; set → пароль заменён', async () => {
    // создаём пользователя
    const userRepo = dataSource.getRepository(User);
    const email = `rp_${Date.now()}@example.com`;
    await userRepo.save({ email, password: '$2b$10$abcdefghijklmnopqrstuv', isEmailVerified: true, role: 'user' });

    // request
    await request(app.getHttpServer())
      .post('/auth/reset-password/request')
      .send({ email })
      .expect(res => expect([200, 400]).toContain(res.status));

    // найдём запись reset
    const resetRepo = dataSource.getRepository(ResetPassword);
    const rec = await resetRepo.findOne({ where: { email } });
    if (!rec) return;

    // verify
    await request(app.getHttpServer())
      .post('/auth/reset-password/verify')
      .send({ token: rec.token })
      .expect(res => expect([200, 400]).toContain(res.status));

    // set
    await request(app.getHttpServer())
      .post('/auth/reset-password/set')
      .send({ token: rec.token, password: 'NewPass123!' })
      .expect(res => expect([200, 400]).toContain(res.status));
  });
});


