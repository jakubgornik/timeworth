import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@packages/db';
// import { UserDto } from './dto/user.dto';
import { UserDto } from './dto/user.dto';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetUsersQuery } from './queries/get-users/get-users.query';
import { DeleteUserCommand } from './commands/delete-user/delete-user.command';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getUsers() {
    return await this.queryBus.execute<GetUsersQuery, UserDto[]>(
      new GetUsersQuery(),
    );
  }

  async deleteUser(id: string) {
    return await this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(id),
    );
  }
}
