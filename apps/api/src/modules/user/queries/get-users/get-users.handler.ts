import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UserDto } from '../../dto/user.dto';
import { PrismaService } from '@packages/db';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, UserDto[]>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.user.findMany();
  }
}
