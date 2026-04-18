import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileMetadataDto } from './dto/personal-storage.dto';
import { GetEmployeeFilesQuery } from './query/get-employee-files/get-employee-files.query';
import { GenerateUploadPresignedUrlsCommand } from './command/generate-upload-presigned-urls/generate-upload-presigned-urls.command';
import { ConfirmUploadCommand } from './command/confirm-upload/confirm-upload.command';
import { SortDto } from 'src/shared/dto/sort.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { DeleteFileCommand } from './command/delete-file/delete-file.command';
import { GetFileDownloadUrlQuery } from './query/download-file/download-file.query';

@Injectable()
export class PersonalStorageService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getStorage(
    userId: string,
    paginationDto: PaginationDto,
    sortDto: SortDto,
  ) {
    return await this.queryBus.execute(
      new GetEmployeeFilesQuery(userId, paginationDto, sortDto),
    );
  }

  async generateUploadPresignedUrls(userId: string, files: FileMetadataDto[]) {
    return await this.commandBus.execute(
      new GenerateUploadPresignedUrlsCommand(userId, files),
    );
  }

  async confirmUpload(userId: string, fileId: string) {
    return await this.commandBus.execute(
      new ConfirmUploadCommand(userId, fileId),
    );
  }

  async deleteFile(userId: string, id: string) {
    return await this.commandBus.execute(new DeleteFileCommand(userId, id));
  }

  async getDownloadUrl(userId: string, id: string) {
    return await this.queryBus.execute(new GetFileDownloadUrlQuery(userId, id));
  }
}
