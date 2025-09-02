import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { IWorkEntryToEventDto } from '@packages/types';
import { GetWorkEntriesQuery } from './get-work-entries.query';
import { mapWorkEntryToEvent } from '../../utils/map-work-entry-to-event';
import { UserNotFoundException } from '../../../user/exceptions/user.exception';

@QueryHandler(GetWorkEntriesQuery)
export class GetWorkEntriesHandler
  implements IQueryHandler<GetWorkEntriesQuery, IWorkEntryToEventDto[]>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    getWorkEntriesQueryDto: GetWorkEntriesQuery,
  ): Promise<IWorkEntryToEventDto[]> {
    return this.getWorkEntries(getWorkEntriesQueryDto);
  }

  private async getWorkEntries(
    query: GetWorkEntriesQuery,
  ): Promise<IWorkEntryToEventDto[]> {
    const {
      getWorkEntriesQueryDto: { userId, currentWeek },
    } = query;

    if (!userId) {
      throw new UserNotFoundException();
    }

    const workEntries = await this.prisma.workEntry.findMany({
      where: {
        userId,
        startedAt: {
          gte: currentWeek?.from,
          lte: currentWeek?.to,
        },
      },
    });

    return workEntries.map(mapWorkEntryToEvent);
  }
}
