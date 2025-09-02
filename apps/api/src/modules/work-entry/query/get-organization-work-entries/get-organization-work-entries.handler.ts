import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, PrismaService } from '@packages/db';
import { IPaginatedResponseDto, IWorkEntryDto } from '@packages/types';
import { GetOrganizationWorkEntriesQuery } from './get-organization-work-entries.query';
import { mapOrganizationWorkEntriesSortDtoToOrderBy } from 'src/shared/mappers/map-organization-work-entries-sort-dto-to-order-by';
import { mapOrganizationWorkEntriesFiltersDtoToWhere } from 'src/shared/mappers/map-organization-work-entries-filters-dto-to-where';
import { ManagerNotFoundException } from '../../exceptions/work-entry.exceptions';

@QueryHandler(GetOrganizationWorkEntriesQuery)
export class GetOrganizationWorkEntriesHandler
  implements
    IQueryHandler<
      GetOrganizationWorkEntriesQuery,
      IPaginatedResponseDto<IWorkEntryDto>
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetOrganizationWorkEntriesQuery,
  ): Promise<IPaginatedResponseDto<IWorkEntryDto>> {
    return this.getOrganizationWorkEntries(query);
  }

  private async getOrganizationWorkEntries(
    query: GetOrganizationWorkEntriesQuery,
  ): Promise<IPaginatedResponseDto<IWorkEntryDto>> {
    const {
      managerId,
      paginationDto: { page, pageSize },
      sortDto,
      filtersDto,
      search,
    } = query;

    if (!managerId) {
      throw new ManagerNotFoundException();
    }

    const orderBy = mapOrganizationWorkEntriesSortDtoToOrderBy(sortDto);
    const filtersWhere = mapOrganizationWorkEntriesFiltersDtoToWhere(
      filtersDto,
      search,
    );

    const where: Prisma.WorkEntryWhereInput = {
      organization: {
        managerId,
      },
      ...filtersWhere,
    };

    const [workEntries, totalCount] = await Promise.all([
      this.prisma.workEntry.findMany({
        orderBy,
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.workEntry.count({
        where: {
          organization: {
            managerId,
          },
        },
      }),
    ]);

    return {
      data: workEntries.map((entry) => ({
        ...entry,
        description: entry.description,
        hourlyRate: entry.hourlyRate,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
