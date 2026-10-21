import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { DeleteWorkEntryCommand } from './delete-work-entry.command';

@CommandHandler(DeleteWorkEntryCommand)
export class DeleteWorkEntryHandler implements ICommandHandler<DeleteWorkEntryCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    id,
    userId,
    organizationId,
  }: DeleteWorkEntryCommand): Promise<void> {
    const { count } = await this.prisma.workEntry.deleteMany({
      where: { id, userId, organizationId },
    });

    if (!count) {
      throw new NotFoundException('Work entry not found');
    }
  }
}
