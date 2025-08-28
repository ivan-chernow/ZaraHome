import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '../config.service';
import { getRateLimitConfig } from '../rate-limit.config';
import { ConfigModule } from '../config.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getRateLimitConfig(configService),
    }),
  ],
})
export class RateLimitConfigModule {}

