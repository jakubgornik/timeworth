import { PrismaService } from '@packages/db';
import { ImportWorkEntriesCommand } from './import-work-entry.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@packages/db';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ImportWorkEntriesCommand)
export class ImportWorkEntriesHandler implements ICommandHandler<ImportWorkEntriesCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ dto }: ImportWorkEntriesCommand) {
    if (!dto.length) return { count: 0 };

    return this.prisma.$transaction(async (tx) => {
      const userIds = [...new Set(dto.map((entry) => entry.userId))];
      const users = await tx.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, organizationId: true },
      });
      const organizations = new Map(
        users.map((user) => [user.id, user.organizationId]),
      );

      const data: Prisma.WorkEntryCreateManyInput[] = dto.map((entry) => {
        const organizationId = organizations.get(entry.userId);
        if (!organizationId) {
          throw new BadRequestException(
            `Cannot find organization for user ${entry.userId}`,
          );
        }
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
          organizationId,
        };
      });

      return tx.workEntry.createMany({ data });
    });
  }
}
