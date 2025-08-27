import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiDefaultErrors = () =>
  applyDecorators(
    ApiBadRequestResponse({ description: 'Некорректные данные запроса (400)' }),
    ApiUnauthorizedResponse({ description: 'Требуется аутентификация (401)' }),
    ApiForbiddenResponse({ description: 'Доступ запрещен (403)' }),
    ApiNotFoundResponse({ description: 'Ресурс не найден (404)' }),
  );


