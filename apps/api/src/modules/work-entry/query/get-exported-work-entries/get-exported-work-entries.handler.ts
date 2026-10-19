import { Prisma, PrismaService } from '@packages/db';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { mapOrganizationWorkEntriesFiltersDtoToWhere } from '../../../../shared/mappers/map-organization-work-entries-filters-dto-to-where';
import { GetExportedWorkEntriesQuery } from './get-exported-work-entries.query';
import { IWorkEntryDto } from '@packages/types';
import { ForbiddenException } from '@nestjs/common';

@QueryHandler(GetExportedWorkEntriesQuery)
export class GetExportedWorkEntriesHandler
  implements IQueryHandler<GetExportedWorkEntriesQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    filtersDto,
    organizationId,
  }: GetExportedWorkEntriesQuery): Promise<IWorkEntryDto[]> {
    if (!organizationId) {
      throw new ForbiddenException('Organization membership required');
    }
    const where: Prisma.WorkEntryWhereInput = {
      organizationId,
      AND: mapOrganizationWorkEntriesFiltersDtoToWhere(filtersDto),
    };

    return await this.prisma.workEntry.findMany({
      where,
      orderBy: { startedAt: 'desc' },
    });
  }
}
