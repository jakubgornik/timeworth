import { Command } from '@nestjs/cqrs';
import { IPresignedUrlResponse } from '@packages/types';
import { FileMetadataDto } from '../../dto/personal-storage.dto';

export class GenerateUploadPresignedUrlsCommand extends Command<
  IPresignedUrlResponse[]
> {
  constructor(
    public readonly userId: string,
    public readonly files: FileMetadataDto[],
  ) {
    super();
  }
}
