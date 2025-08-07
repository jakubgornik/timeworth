import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetOrganizationUsersQuery } from './queries/get-organization-users/get-organization-users.query';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { GetUserByIdQuery } from './queries/get-user-by-id/get-user-by-id.query';
import { OrganizationUsersFiltersDto } from './exceptions/organization-users-filters.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getOrganizationUsers(
    managerId: string,
    search: string,
    paginationDto: PaginationDto,
    sortDto: SortDto,
    filtersDto: OrganizationUsersFiltersDto,
  ) {
    return await this.queryBus.execute(
      new GetOrganizationUsersQuery(
        managerId,
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

  // These are examples how to work with queries and commands

  // async getUsers() {
  //   return await this.queryBus.execute<GetUsersQuery, UserDto[]>(
  //     new GetUsersQuery(),
  //   );
  // }

  // async deleteUser(id: string) {
  //   return await this.commandBus.execute<DeleteUserCommand, void>(
  //     new DeleteUserCommand(id),
  //   );
  // }
}
