import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { DeleteUserCommand } from './delete-user.command';
import { UserNotFoundException } from '../../exceptions/user.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalServerErrorException, Logger } from '@nestjs/common';

// TODO: map other errors, move to utils
const PRISMA_ERROR_MAP: Record<string, typeof UserNotFoundException> = {
  P2025: UserNotFoundException,
};

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  private readonly logger = new Logger(DeleteUserHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const PrismaErrorClass = PRISMA_ERROR_MAP[error.code];

        if (PrismaErrorClass) {
          throw new PrismaErrorClass();
        }
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
