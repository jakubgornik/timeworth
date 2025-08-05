import { Prisma } from '@packages/db';
import { OrganizationWorkEntriesFiltersDto } from 'src/modules/work-entry/dto/organization-work-entries-filters.dto';

export const mapOrganizationWorkEntriesFiltersDtoToWhere = (
  filters: OrganizationWorkEntriesFiltersDto,
  search: string,
): Prisma.WorkEntryWhereInput => {
  const where: Prisma.WorkEntryWhereInput = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filters.title) {
    where.title = {
      contains: filters.title,
      mode: 'insensitive',
    };
  }

  if (filters.hoursWorked) {
    where.hoursWorked = filters.hoursWorked;
  }

  if (filters.workEntryStartedAt && filters.workEntryEndedAt) {
    const startDate = new Date(filters.workEntryStartedAt);
    const endDate = new Date(filters.workEntryEndedAt);

    const isSameDay = startDate.toDateString() === endDate.toDateString();

    if (isSameDay) {
      const dayStart = new Date(startDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(startDate);
      dayEnd.setHours(23, 59, 59, 999);

      where.OR = [
        {
          startedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        {
          endedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        {
          AND: [{ startedAt: { lte: dayStart } }, { endedAt: { gte: dayEnd } }],
        },
      ];
    } else {
      where.AND = [
        {
          startedAt: {
            lte: endDate,
          },
        },
        {
          endedAt: {
            gte: startDate,
          },
        },
      ];
    }
  }

  return where;
};
