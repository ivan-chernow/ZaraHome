export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {}

export interface ErrorResponse {
  status: number;
  message: string;
  error: string;
  timestamp: string;
}
