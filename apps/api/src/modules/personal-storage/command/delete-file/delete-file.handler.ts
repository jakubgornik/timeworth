import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@packages/db';
import { DeleteFileCommand } from './delete-file.command';
import { StorageService } from 'src/modules/storage.service';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async execute({ userId, id }: DeleteFileCommand): Promise<void> {
    const file = await this.prisma.storedFile.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!file) {
      throw new NotFoundException();
    }

    await this.storageService.removeFile(file.s3Path);
    await this.prisma.storedFile.delete({
      where: {
        id,
      },
    });
  }
}
