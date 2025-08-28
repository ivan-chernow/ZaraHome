import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '../config.service';
import { getRateLimitConfig } from '../rate-limit.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getRateLimitConfig(configService),
    }),
  ],
})
export class RateLimitConfigModule {}

