import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService, FileStatus, StoredFile } from '@packages/db';
import { ConfirmUploadCommand } from './confirm-upload.command';

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadHandler
  implements ICommandHandler<ConfirmUploadCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, fileId }: ConfirmUploadCommand): Promise<StoredFile> {
    return await this.prisma.storedFile.update({
      where: { id: fileId, userId: userId },
      data: { status: FileStatus.UPLOADED },
    });
  }
}
