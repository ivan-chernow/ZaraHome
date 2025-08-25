export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
  timestamp: string;
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
