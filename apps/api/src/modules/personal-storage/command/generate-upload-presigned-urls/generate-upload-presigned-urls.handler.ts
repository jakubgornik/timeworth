import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService, FileStatus } from '@packages/db';
import { GenerateUploadPresignedUrlsCommand } from './generate-upload-presigned-urls.command';
import { StorageService } from 'src/modules/storage.service';
import { IPresignedUrlResponse } from '@packages/types';

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
    const s3Results = await Promise.all(
      files.map(async (file) => {
        const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}-${safeOriginalName}`;
        const s3Path = `users/${userId}/${fileName}`;
        const contentType = file.type;

        const uploadUrl = await this.storageService.getPresignedUploadUrl(
          s3Path,
          contentType,
        );

        return { file, s3Path, contentType, uploadUrl };
      }),
    );

    const storedFiles = await Promise.all(
      s3Results.map(({ file, s3Path, contentType }) =>
        this.prisma.storedFile.create({
          data: {
            s3Path,
            type: contentType,
            name: file.name,
            size: file.size,
            status: FileStatus.PENDING,
            userId,
          },
        }),
      ),
    );

    return s3Results.map((result, index) => ({
      id: storedFiles[index].id,
      uploadUrl: result.uploadUrl,
    }));
  }
}
