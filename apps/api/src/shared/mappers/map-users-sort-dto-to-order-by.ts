import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapUsersSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.UserOrderByWithRelationInput[] => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'name':
      return [{ name: sortOrder }, { id: 'asc' }];
    case 'email':
      return [{ email: sortOrder }, { id: 'asc' }];
    case 'status':
      return [{ status: sortOrder }, { id: 'asc' }];
    default:
      return [{ id: sortOrder }];
  }
};
