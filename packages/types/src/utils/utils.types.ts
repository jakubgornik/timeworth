export interface PaginatedResponse<TData> {
  data: TData[];
  totalCount: number;
  page: number;
  pageSize: number;
}
