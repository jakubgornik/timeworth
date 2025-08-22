import { Prisma } from '@packages/db';

interface FilteredWorkEntriesParams {
  from?: string;
  to?: string;
  year?: string;
}

export const mapFilteredWorkEntriesDtoToWhere = (
  filters: FilteredWorkEntriesParams,
): Prisma.WorkEntryWhereInput => {
  const where: Prisma.WorkEntryWhereInput = {};

  if (filters.from && filters.to) {
    const startDate = new Date(filters.from);
    const endDate = new Date(filters.to);

    startDate.setHours(0, 0, 0, 0);

    endDate.setHours(23, 59, 59, 999);

    where.startedAt = {
      gte: startDate,
      lte: endDate,
    };
  } else if (filters.year) {
    const yearNum = parseInt(filters.year);
    const yearStart = new Date(`${yearNum}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${yearNum}-12-31T23:59:59.999Z`);

    where.startedAt = {
      gte: yearStart,
      lte: yearEnd,
    };
  }

  return where;
};
