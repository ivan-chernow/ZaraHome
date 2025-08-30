import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entity/refresh-token.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../../users/user/entity/user.entity';
import { AuthRepository } from '../auth.repository';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { 
          expiresIn: configService.get<string>('jwt.accessExpiresIn') || '15m' 
        },
      }),
    }),
  ],
  providers: [LoginService, JwtStrategy, AuthRepository],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}