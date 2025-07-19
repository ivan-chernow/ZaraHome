import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { RegisterModule } from './register/register.module';

@Module({
    imports: [
        RegisterModule,
        LoginModule,
        ResetPasswordModule,
    ],
})
export class AuthModule { }
