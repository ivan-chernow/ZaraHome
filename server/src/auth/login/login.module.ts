import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../../users/user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from '../auth.repository';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User, RefreshToken]),
        PassportModule,
        SharedModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
    ],
    providers: [LoginService, JwtStrategy, AuthRepository],
    controllers: [LoginController],
})
export class LoginModule {}