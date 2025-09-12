import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from 'src/email/entity/email-verification.entity';
import { RegistrationService } from './register.service';
import { EmailModule } from 'src/email/email.module';
import { RegistrationController } from './register.controller';
import { User } from '../../users/user/entity/user.entity';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification]),
    EmailModule,
    SharedModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegisterModule {}
