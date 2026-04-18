import { Query } from '@nestjs/cqrs';
import { IPaginatedResponseDto, IStorageFileDto } from '@packages/types';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';

export class GetEmployeeFilesQuery extends Query<
  IPaginatedResponseDto<IStorageFileDto>
> {
  constructor(
    public readonly userId: string,
    public readonly paginationDto: PaginationDto,
    public readonly sortDto: SortDto,
  ) {
    super();
  }
}
