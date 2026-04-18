import { Query } from '@nestjs/cqrs';
import { IGetFileDownloadUrlDto } from '@packages/types';

export class GetFileDownloadUrlQuery extends Query<IGetFileDownloadUrlDto> {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {
    super();
  }
}
