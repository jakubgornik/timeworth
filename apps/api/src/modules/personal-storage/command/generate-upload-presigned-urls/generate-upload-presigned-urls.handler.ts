import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService, FileStatus } from '@packages/db';
import { GenerateUploadPresignedUrlsCommand } from './generate-upload-presigned-urls.command';
import { StorageService } from '../../../storage.service';
import { IPresignedUrlResponse, STORAGE_LIMITS } from '@packages/types';

@CommandHandler(GenerateUploadPresignedUrlsCommand)
export class GenerateUploadPresignedUrlsHandler
  implements ICommandHandler<GenerateUploadPresignedUrlsCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async execute({
    userId,
    files,
  }: GenerateUploadPresignedUrlsCommand): Promise<IPresignedUrlResponse[]> {
    const reservations = await Promise.all(
      files.map(async (file) => {
        const id = randomUUID();
        const s3Path = `users/${userId}/${id}`;
        const uploadUrl = await this.storageService.getPresignedUploadUrl(
          s3Path,
          file.type,
          file.size,
        );
        return {
          data: { ...file, id, s3Path, userId, status: FileStatus.PENDING },
          uploadUrl,
        };
      }),
    );

    await this.prisma.$transaction(async (tx) => {
      // Serialize reservations for this user across every API instance.
      const users = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE
      `;
      if (!users.length) throw new ForbiddenException();

      // Keep PENDING and FAILED reservations charged until explicitly deleted.
      const usage = await tx.storedFile.aggregate({
        where: { userId, size: { gt: 0 } },
        _sum: { size: true },
      });
      const currentFileCount = await tx.storedFile.count({ where: { userId } });
      const requestedBytes = files.reduce(
        (total, file) => total + file.size,
        0,
      );
      const currentStorageBytes = usage._sum.size ?? 0;
      const totalFileCount = currentFileCount + files.length;
      const totalStorageBytes = currentStorageBytes + requestedBytes;
      const exceedsFileLimit = totalFileCount > STORAGE_LIMITS.maxUserFiles;
      const exceedsStorageLimit =
        totalStorageBytes > STORAGE_LIMITS.maxUserBytes;

      if (exceedsFileLimit || exceedsStorageLimit) {
        throw new UnprocessableEntityException(
          'Personal storage quota exceeded',
        );
      }
      await tx.storedFile.createMany({
        data: reservations.map((reservation) => reservation.data),
      });
    });

    return reservations.map(({ data, uploadUrl }) => ({
      id: data.id,
      uploadUrl,
    }));
  }
}
