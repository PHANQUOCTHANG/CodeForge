export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T; // T ở đây sẽ là AuthDto
  errors: string[] | null;
}

export interface PagedResponse<T> {
  data: T[];
  totalItems: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
