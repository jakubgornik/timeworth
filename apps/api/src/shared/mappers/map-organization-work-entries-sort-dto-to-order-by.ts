import { Prisma } from '@packages/db';
import { ISortDto } from '@packages/types';

export const mapOrganizationWorkEntriesSortDtoToOrderBy = (
  sortDto: ISortDto,
): Prisma.WorkEntryOrderByWithRelationInput => {
  const sortOrder = sortDto.desc ? 'desc' : 'asc';

  switch (sortDto.id) {
    case 'title':
      return {
        title: sortOrder,
      };
    case 'hoursWorked':
      return {
        hoursWorked: sortOrder,
      };
    default:
      return {
        title: sortOrder,
      };
  }
};
