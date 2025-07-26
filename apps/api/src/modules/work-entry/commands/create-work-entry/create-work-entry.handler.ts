import { PrismaService } from '@packages/db';
import { CreateWorkEntryCommand } from './create-work-entry.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateWorkEntryCommand)
export class CreateWorkEntryHandler
  implements ICommandHandler<CreateWorkEntryCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ createWorkEntryDto }: CreateWorkEntryCommand): Promise<void> {
    const { startedAt, endedAt } = createWorkEntryDto;

    const hoursWorked =
      (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

    await this.prisma.workEntry.create({
      data: {
        ...createWorkEntryDto,
        hoursWorked,
      },
    });
  }
}
