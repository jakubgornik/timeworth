import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapUsersSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.UserOrderByWithRelationInput => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'name':
      return {
        name: sortOrder,
      };
    case 'email':
      return {
        email: sortOrder,
      };
    case 'status':
      return {
        status: sortOrder,
      };
    default:
      return {
        id: sortOrder,
      };
  }
};
