import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailVerification } from './entity/email-verification.entity';
import { SharedModule } from '../shared/modules/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerification]), SharedModule],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
  exports: [EmailService, EmailRepository],
})
export class EmailModule {}
