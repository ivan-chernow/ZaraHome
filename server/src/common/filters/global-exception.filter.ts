import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HttpException (включая кастомные)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; code?: string; details?: unknown };

      const message = typeof res === 'string' ? res : Array.isArray(res?.message) ? res.message.join(', ') : res?.message;
      const code = typeof res === 'string' ? undefined : res?.code;
      const details = typeof res === 'string' ? undefined : res?.details;

      return response.status(status).json({
        success: false,
        message: message || exception.message,
        code,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Неизвестные ошибки
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (exception as Error)?.message || 'Внутренняя ошибка сервера';

    return response.status(status).json({
      success: false,
      message,
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}


