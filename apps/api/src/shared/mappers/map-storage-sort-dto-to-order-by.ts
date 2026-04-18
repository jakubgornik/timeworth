import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapStorageSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.StoredFileOrderByWithRelationInput => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'name':
      return {
        name: sortOrder,
      };
    case 'size':
      return {
        size: sortOrder,
      };
    case 'uploadDate':
      return {
        createdAt: sortOrder,
      };
    default:
      return {
        name: sortOrder,
      };
  }
};
