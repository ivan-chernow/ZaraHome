import { Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class ConditionalThrottlerGuard {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // В development режиме отключаем rate limiting полностью
    if (this.configService.isDevelopment) {
      return true;
    }
    
    // В production можно добавить простую логику rate limiting
    // Пока просто разрешаем все запросы
    return true;
  }
}

