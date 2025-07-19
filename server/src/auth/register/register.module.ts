import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from 'src/email/entity/email-verification.entity';
import { RegistrationService } from './register.service';
import { EmailModule } from 'src/email/email.module';
import { RegistrationController } from './register.controller';
import { User } from 'src/users/user/entity/user.entity';
@Module({
    imports: [TypeOrmModule.forFeature([User, EmailVerification]), EmailModule],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegisterModule { }