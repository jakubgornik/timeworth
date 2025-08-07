import { Prisma } from '@packages/db';
import { OrganizationUsersFiltersDto } from 'src/modules/user/dto/organization-users-filters.dto';

export const mapOrganizationUsersFiltersDtoToWhere = (
  filters: OrganizationUsersFiltersDto,
  search: string,
): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filters.email) {
    where.email = {
      contains: filters.email,
      mode: 'insensitive',
    };
  }

  if (filters.userStatus && filters.userStatus.length > 0) {
    where.status = {
      in: filters.userStatus,
    };
  }

  return where;
};
