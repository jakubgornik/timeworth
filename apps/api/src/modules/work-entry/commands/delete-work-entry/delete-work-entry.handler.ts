import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { DeleteWorkEntryCommand } from './delete-work-entry.command';

@CommandHandler(DeleteWorkEntryCommand)
export class DeleteWorkEntryHandler
  implements ICommandHandler<DeleteWorkEntryCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: DeleteWorkEntryCommand): Promise<void> {
    await this.prisma.workEntry.delete({
      where: { id },
    });
  }
}
