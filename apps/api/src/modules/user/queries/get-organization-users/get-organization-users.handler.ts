import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, PrismaService } from '@packages/db';
import { GetOrganizationUsersQuery } from './get-organization-users.query';
import {
  IPaginatedResponseDto,
  ICurrentUserDto as IUserDto,
} from '@packages/types';
import { mapUsersSortDtoToOrderBy } from '../../../../shared/mappers/map-users-sort-dto-to-order-by';
import { mapOrganizationUsersFiltersDtoToWhere } from '../../../../shared/mappers/map-organization-users-filters-dto-to-where';
import { ManagerNotFoundException } from '../../exceptions/user.exception';

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
      organizationId,
      paginationDto: { page, pageSize },
      sortDto,
      filtersDto,
      search,
    } = organizationUsersQueryDto;

    if (!organizationId) {
      throw new ManagerNotFoundException();
    }

    const orderBy = mapUsersSortDtoToOrderBy(sortDto);
    const filtersWhere = mapOrganizationUsersFiltersDtoToWhere(
      filtersDto,
      search,
    );

    const where: Prisma.UserWhereInput = {
      role: 'EMPLOYEE',
      organizationId,
      AND: filtersWhere,
    };

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        orderBy,
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              managerId: true,
              industry: true,
              size: true,
              address: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
              managerId: user.organization.managerId,
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
