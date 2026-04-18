import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@packages/db';
import { GetFileDownloadUrlQuery } from './download-file.query';
import { StorageService } from 'src/modules/storage.service';
import { IGetFileDownloadUrlDto } from '@packages/types';

@QueryHandler(GetFileDownloadUrlQuery)
export class GetFileDownloadUrlHandler
  implements IQueryHandler<GetFileDownloadUrlQuery>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async execute({
    userId,
    id,
  }: GetFileDownloadUrlQuery): Promise<IGetFileDownloadUrlDto> {
    const file = await this.prisma.storedFile.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!file) {
      throw new NotFoundException();
    }

    const url = await this.storageService.getPresignedDownloadUrl(file.s3Path);

    return { url };
  }
}
