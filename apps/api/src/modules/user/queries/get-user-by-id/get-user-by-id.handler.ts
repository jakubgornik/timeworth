import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserNotFoundException } from '../../exceptions/user.exception';
import { ICurrentUserDto } from '@packages/types';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, ICurrentUserDto>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(uerByIdQueryDto: GetUserByIdQuery) {
    const { userId } = uerByIdQueryDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        organization: {
          select: {
            id: true,
            name: true,
            managerId: true,
          },
        },
        role: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
