import { CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { DeleteUserCommand } from './delete-user.command';
import { UserNotFoundException } from '../../exceptions/user.exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
