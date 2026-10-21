import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService, FileStatus, StoredFile } from '@packages/db';
import { ConfirmUploadCommand } from './confirm-upload.command';
import { StorageService } from '../../../storage.service';
import { STORAGE_LIMITS } from '@packages/types';

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadHandler
  implements ICommandHandler<ConfirmUploadCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async execute({ userId, fileId }: ConfirmUploadCommand): Promise<StoredFile> {
    const file = await this.prisma.storedFile.findFirst({
      where: { id: fileId, userId },
    });
    if (!file) throw new NotFoundException();
    if (file.status === FileStatus.FAILED) {
      throw new BadRequestException(
        'Upload has failed; delete it before retrying',
      );
    }

    // Verify size and Content-Type using S3 HEAD, even for repeat confirmations.
    const object = await this.storageService.getFileMetadata(file.s3Path);
    const hasSizeMismatch = object.size !== file.size;
    const hasTypeMismatch = object.type !== file.type;
    const isSizeBelowMinimum = file.size < 1;
    const exceedsFileSizeLimit = file.size > STORAGE_LIMITS.maxFileBytes;
    const hasUnsupportedMimeType = !STORAGE_LIMITS.allowedMimeTypes.some(
      (type) => type === file.type,
    );

    if (
      hasSizeMismatch ||
      hasTypeMismatch ||
      isSizeBelowMinimum ||
      exceedsFileSizeLimit ||
      hasUnsupportedMimeType
    ) {
      await this.prisma.storedFile.updateMany({
        where: { id: fileId, userId },
        data: { status: FileStatus.FAILED },
      });
      throw new BadRequestException(
        'Uploaded file does not match its declared size or type',
      );
    }

    const updated = await this.prisma.storedFile.updateMany({
      where: {
        id: fileId,
        userId,
        status: { in: [FileStatus.PENDING, FileStatus.UPLOADED] },
      },
      data: { status: FileStatus.UPLOADED },
    });

    if (!updated.count) throw new NotFoundException();
    return { ...file, status: FileStatus.UPLOADED };
  }
}
