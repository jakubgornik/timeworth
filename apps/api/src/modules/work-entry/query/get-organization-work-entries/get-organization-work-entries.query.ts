import { Query } from '@nestjs/cqrs';
import { IPaginatedResponseDto, IWorkEntryDto } from '@packages/types';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { OrganizationWorkEntriesFiltersDto } from '../../dto/organization-work-entries-filters.dto';

export class GetOrganizationWorkEntriesQuery extends Query<
  IPaginatedResponseDto<IWorkEntryDto>
> {
  constructor(
    public readonly managerId: string,
    public readonly search: string,
    public readonly paginationDto: PaginationDto,
    public readonly sortDto: SortDto,
    public readonly filtersDto: OrganizationWorkEntriesFiltersDto,
  ) {
    super();
  }
}
