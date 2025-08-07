import { Query } from '@nestjs/cqrs';
import {
  IPaginatedResponseDto,
  ICurrentUserDto as IUserDto,
} from '@packages/types';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { OrganizationUsersFiltersDto } from '../../exceptions/organization-users-filters.dto';

export class GetOrganizationUsersQuery extends Query<
  IPaginatedResponseDto<IUserDto>
> {
  constructor(
    public readonly managerId: string,
    public readonly search: string,
    public readonly paginationDto: PaginationDto,
    public readonly sortDto: SortDto,
    public readonly filtersDto: OrganizationUsersFiltersDto,
  ) {
    super();
  }
}
