import { Prisma, PrismaService } from '@packages/db';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { mapOrganizationWorkEntriesFiltersDtoToWhere } from '../../../../shared/mappers/map-organization-work-entries-filters-dto-to-where';
import { GetExportedWorkEntriesQuery } from './get-exported-work-entries.query';
import { IWorkEntryDto } from '@packages/types';

@QueryHandler(GetExportedWorkEntriesQuery)
export class GetExportedWorkEntriesHandler
  implements IQueryHandler<GetExportedWorkEntriesQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    filtersDto,
  }: GetExportedWorkEntriesQuery): Promise<IWorkEntryDto[]> {
    const where: Prisma.WorkEntryWhereInput =
      mapOrganizationWorkEntriesFiltersDtoToWhere(filtersDto);

    return await this.prisma.workEntry.findMany({
      where,
      orderBy: { startedAt: 'desc' },
    });
  }
}
