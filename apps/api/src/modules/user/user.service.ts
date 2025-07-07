import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { OrganizationUsersQueryDto } from './dto/organization-users.dto';
import { GetOrganizationUsersQuery } from './queries/get-organization-users/get-organization-users.query';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getOrganizationUsers(
    organizationUsersQueryDto: OrganizationUsersQueryDto,
  ) {
    return await this.queryBus.execute(
      new GetOrganizationUsersQuery(organizationUsersQueryDto),
    );
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
