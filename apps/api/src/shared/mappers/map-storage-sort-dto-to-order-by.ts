import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapStorageSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.StoredFileOrderByWithRelationInput[] => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'name':
      return [{ name: sortOrder }, { id: 'asc' }];
    case 'size':
      return [{ size: sortOrder }, { id: 'asc' }];
    case 'uploadDate':
      return [{ createdAt: sortOrder }, { id: 'asc' }];
    default:
      return [{ name: sortOrder }, { id: 'asc' }];
  }
};
