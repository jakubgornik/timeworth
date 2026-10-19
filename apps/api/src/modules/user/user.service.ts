import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrganizationUsersQuery } from './queries/get-organization-users/get-organization-users.query';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { GetUserByIdQuery } from './queries/get-user-by-id/get-user-by-id.query';
import { GetUserStatusOptionsQuery } from './queries/get-user-status-options/get-user-status-options.query';
import { OrganizationUsersFiltersDto } from './dto/organization-users-filters.dto';
import { GetListedOrganizationUsersQuery } from './queries/get-listed-organization-users/get-listed-organization-users.query';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { requireManagerOrganization } from '../../shared/auth/authorization';

@Injectable()
export class UserService {
  constructor(private readonly queryBus: QueryBus) {}

  async getOrganizationUsers(
    user: AuthenticatedUser,
    search: string,
    paginationDto: PaginationDto,
    sortDto: SortDto,
    filtersDto: OrganizationUsersFiltersDto,
  ) {
    return await this.queryBus.execute(
      new GetOrganizationUsersQuery(
        requireManagerOrganization(user),
        search,
        paginationDto,
        sortDto,
        filtersDto,
      ),
    );
  }

  async getUserById(userId: string) {
    return await this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  async getUserStatusOptions() {
    return await this.queryBus.execute(new GetUserStatusOptionsQuery());
  }

  async getListedOrganizationUsers(user: AuthenticatedUser) {
    return await this.queryBus.execute(
      new GetListedOrganizationUsersQuery(requireManagerOrganization(user)),
    );
  }
}
