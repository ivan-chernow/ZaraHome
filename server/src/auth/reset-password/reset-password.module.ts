import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from './entity/reset-password.entity';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { EmailModule } from 'src/email/email.module';
import { User } from '../../users/user/entity/user.entity';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPassword, User]), 
    EmailModule, 
    SharedModule
  ],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
