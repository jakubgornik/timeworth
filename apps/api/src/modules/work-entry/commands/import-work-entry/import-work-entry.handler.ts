import { PrismaService } from '@packages/db';
import { ImportWorkEntriesCommand } from './import-work-entry.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@packages/db';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ImportWorkEntriesCommand)
export class ImportWorkEntriesHandler
  implements ICommandHandler<ImportWorkEntriesCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ dto }: ImportWorkEntriesCommand) {
    for (const entry of dto) {
      const user = await this.prisma.user.findUnique({
        where: { id: entry.userId },
        select: { organizationId: true },
      });

      if (!user || !user.organizationId) {
        throw new BadRequestException(
          `Cannot find organization for user ${entry.userId}`,
        );
      }

      entry.organizationId = user.organizationId;
    }

    const data: Prisma.WorkEntryCreateManyInput[] = dto.map((entry) => {
      const hoursWorked =
        (entry.endedAt.getTime() - entry.startedAt.getTime()) /
        (1000 * 60 * 60);

      return {
        title: entry.title,
        startedAt: entry.startedAt,
        endedAt: entry.endedAt,
        description: entry.description ?? '',
        hoursWorked,
        userId: entry.userId,
        organizationId: entry.organizationId,
      };
    });

    return await this.prisma.workEntry.createMany({
      data,
    });
  }
}
