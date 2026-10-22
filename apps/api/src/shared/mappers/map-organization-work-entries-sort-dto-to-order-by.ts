import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapOrganizationWorkEntriesSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.WorkEntryOrderByWithRelationInput[] => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'title':
      return [{ title: sortOrder }, { id: 'asc' }];
    case 'hoursWorked':
      return [{ hoursWorked: sortOrder }, { id: 'asc' }];
    default:
      return [{ title: sortOrder }, { id: 'asc' }];
  }
};
