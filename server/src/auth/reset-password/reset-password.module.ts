import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from './entity/reset-password.entity';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { EmailModule } from 'src/email/email.module';
import { User } from 'src/users/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPassword, User]), EmailModule],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
