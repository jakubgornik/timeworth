export interface PaginatedResponse<TData> {
  data: TData[];
  totalCount: number;
  totalPages: number;
}
