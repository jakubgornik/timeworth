import { CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // recplace with custom exception using Http exception
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
