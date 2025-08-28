import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config.service';
import { getJwtConfig } from '../jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtConfig(configService),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}

