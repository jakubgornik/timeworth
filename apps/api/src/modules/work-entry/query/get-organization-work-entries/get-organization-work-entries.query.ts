import { Query } from '@nestjs/cqrs';
import { IPaginatedResponseDto, IWorkEntryDto } from '@packages/types';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';

export class GetOrganizationWorkEntriesQuery extends Query<
  IPaginatedResponseDto<IWorkEntryDto>
> {
  constructor(
    public readonly managerId: string,
    public readonly paginationDto: PaginationDto,
    public readonly sortDto: SortDto,
  ) {
    super();
  }
}
