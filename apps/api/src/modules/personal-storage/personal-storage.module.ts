import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';
import { StorageModule } from '../storage.module';
import { PersonalStorageController } from './personal-storage.controller';
import { PersonalStorageService } from './personal-storage.service';
import { ConfirmUploadHandler } from './command/confirm-upload/confirm-upload.handler';
import { GenerateUploadPresignedUrlsHandler } from './command/generate-upload-presigned-urls/generate-upload-presigned-urls.handler';
import { GetEmployeeFilesHandler } from './query/get-employee-files/get-employee-files.handler';
import { DeleteFileHandler } from './command/delete-file/delete-file.handler';
import { GetFileDownloadUrlHandler } from './query/download-file/download-file.handler';

const services = [PersonalStorageService];

const commandHandlers = [
  ConfirmUploadHandler,
  GenerateUploadPresignedUrlsHandler,
  DeleteFileHandler,
  GetFileDownloadUrlHandler,
];
const queryHandlers = [GetEmployeeFilesHandler];

@Module({
  controllers: [PersonalStorageController],
  providers: [...services, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PrismaModule, StorageModule],
})
export class PersonalStorageModule {}
