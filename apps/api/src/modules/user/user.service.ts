import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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
