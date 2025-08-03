import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { IPaginatedResponseDto, IWorkEntryDto } from '@packages/types';
import { GetOrganizationWorkEntriesQuery } from './get-organization-work-entries.query';

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
      //   sortDto,
    } = query;

    // TODO custom exception
    if (!managerId) {
      throw new Error('Manager ID is required');
    }

    // TODO: sorting, filtering
    // const orderBy = mapOrganizationWorkEntriesSortDtoToOrderBy(sortDto);

    const [workEntries, totalCount] = await Promise.all([
      this.prisma.workEntry.findMany({
        // orderBy,
        where: {
          organization: {
            managerId,
          },
        },
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
