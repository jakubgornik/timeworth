import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@packages/db';
// import { UserDto } from './dto/user.dto';
import { UserDto } from './dto/user.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from './queries/get-users/get-users.query';

@Injectable()
export class UserService {
  constructor(private readonly queryBus: QueryBus) {}

  async getUsers() {
    return await this.queryBus.execute<GetUsersQuery, UserDto[]>(
      new GetUsersQuery(),
    );
  }
}
