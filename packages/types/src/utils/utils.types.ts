export interface IPaginatedResponseDto<TData> {
  data: TData[];
  totalCount: number;
  totalPages: number;
}

export interface IPaginationDto {
  page: number;
  pageSize: number;
}

export interface ISortDto {
  id?: string;
  desc?: boolean;
}

export interface IPaginatedQueryDto extends IPaginationDto, ISortDto {}
