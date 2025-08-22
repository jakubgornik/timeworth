import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, PrismaService } from '@packages/db';
import { IWorkEntryDtoWithUser } from '@packages/types';
import { ManagerNotFoundException } from '../../exceptions/manager.exception';
import { GetFilteredOrganizationWorkEntriesQuery } from './get-filtered-organization-work-entries.query';
import { mapFilteredWorkEntriesDtoToWhere } from 'src/shared/mappers/map-filtered-organization-work-entries-to-where';

@QueryHandler(GetFilteredOrganizationWorkEntriesQuery)
export class GetFilteredOrganizationWorkEntriesHandler
  implements
    IQueryHandler<
      GetFilteredOrganizationWorkEntriesQuery,
      IWorkEntryDtoWithUser[]
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetFilteredOrganizationWorkEntriesQuery,
  ): Promise<IWorkEntryDtoWithUser[]> {
    return this.getFilteredOrganizationWorkEntries(query);
  }

  private async getFilteredOrganizationWorkEntries(
    query: GetFilteredOrganizationWorkEntriesQuery,
  ): Promise<IWorkEntryDtoWithUser[]> {
    const {
      dto: { selectedUserId, from, to, year },
      managerId,
    } = query;

    if (!managerId) {
      throw new ManagerNotFoundException();
    }

    const filtersWhere = mapFilteredWorkEntriesDtoToWhere({
      from,
      to,
      year,
    });

    const where: Prisma.WorkEntryWhereInput = {
      organization: {
        managerId,
      },
      ...filtersWhere,
    };

    if (selectedUserId) {
      where.userId = selectedUserId;
    }

    const workEntries = await this.prisma.workEntry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return workEntries;
  }
}
