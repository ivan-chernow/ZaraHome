import { Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConditionalThrottlerGuard {
  constructor(private readonly _configService: ConfigService) {}

  async canActivate(_context: ExecutionContext): Promise<boolean> {
    // В development режиме отключаем rate limiting полностью
    if (this._configService.get('app.isDevelopment')) {
      return true;
    }

    // В production можно добавить простую логику rate limiting
    // Пока просто разрешаем все запросы
    return true;
  }
}
