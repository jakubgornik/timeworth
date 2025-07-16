import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { GetOrganizationUsersQuery } from './get-organization-users.query';
import {
  IPaginatedResponseDto,
  ICurrentUserDto as IUserDto,
} from '@packages/types';
import { mapUsersSortDtoToOrderBy } from 'src/shared/mappers/map-users-sort-dto-to-order-by';

@QueryHandler(GetOrganizationUsersQuery)
export class GetOrganizationUsersHandler
  implements
    IQueryHandler<GetOrganizationUsersQuery, IPaginatedResponseDto<IUserDto>>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(organizationUsersQueryDto: GetOrganizationUsersQuery) {
    return this.getOrganizationUsers(organizationUsersQueryDto);
  }

  private async getOrganizationUsers(
    organizationUsersQueryDto: GetOrganizationUsersQuery,
  ): Promise<IPaginatedResponseDto<IUserDto>> {
    const {
      managerId,
      paginationDto: { page, pageSize },
      sortDto,
    } = organizationUsersQueryDto;
    // TODO custom exception
    if (!managerId) {
      throw new Error('Manager ID is required');
    }

    const orderBy = mapUsersSortDtoToOrderBy(sortDto);

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        orderBy,
        where: {
          role: 'EMPLOYEE',
          organization: {
            managerId,
          },
        },
        include: {
          organization: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({
        where: {
          organization: {
            managerId,
          },
          role: 'EMPLOYEE',
        },
      }),
    ]);

    return {
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        organization: user.organization
          ? {
              ...user.organization,
              createdAt: user.organization.createdAt.toISOString(),
              updatedAt: user.organization.updatedAt.toISOString(),
              industry: user.organization.industry ?? undefined,
              size: user.organization.size ?? undefined,
              address: user.organization.address ?? undefined,
            }
          : null,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
