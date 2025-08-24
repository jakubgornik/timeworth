import { Prisma } from '@packages/db';
import { OrganizationWorkEntriesFiltersDto } from 'src/modules/work-entry/dto/organization-work-entries-filters.dto';

export const mapOrganizationWorkEntriesFiltersDtoToWhere = (
  filters?: OrganizationWorkEntriesFiltersDto,
  search?: string,
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

  if (filters?.title) {
    where.title = {
      contains: filters.title,
      mode: 'insensitive',
    };
  }

  if (filters?.hoursWorked) {
    where.hoursWorked = filters.hoursWorked;
  }

  if (filters?.workEntryStartedAt && filters?.workEntryEndedAt) {
    const startDate = new Date(filters.workEntryStartedAt);
    const endDate = new Date(filters.workEntryEndedAt);
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (isSameDay) {
      where.OR = [
        {
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { startedAt: { lte: startDate } },
            { endedAt: { gte: endDate } },
          ],
        },
      ];
    } else {
      where.OR = [
        {
          startedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { startedAt: { lte: startDate } },
            { endedAt: { gte: endDate } },
          ],
        },
      ];
    }
  }

  return where;
};
