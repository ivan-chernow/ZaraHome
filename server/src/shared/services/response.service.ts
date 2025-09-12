import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../shared.interfaces';

@Injectable()
export class ResponseService {
  success<T>(data: T, message: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  error(message: string, error?: string): ApiResponse<never> {
    return {
      success: false,
      message,
      error,
    };
  }
}
