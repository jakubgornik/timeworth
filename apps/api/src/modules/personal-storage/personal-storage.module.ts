import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { StorageService } from '../storage.service';
import { PersonalStorageController } from './personal-storage.controller';
import { PersonalStorageService } from './personal-storage.service';
import { ConfirmUploadHandler } from './command/confirm-upload/confirm-upload.handler';
import { GenerateUploadPresignedUrlsHandler } from './command/generate-upload-presigned-urls/generate-upload-presigned-urls.handler';
import { GetEmployeeFilesHandler } from './query/get-employee-files/get-employee-files.handler';

const services = [PersonalStorageService, StorageService, PrismaService];

const commandHandlers = [
  ConfirmUploadHandler,
  GenerateUploadPresignedUrlsHandler,
];
const queryHandlers = [GetEmployeeFilesHandler];

@Module({
  controllers: [PersonalStorageController],
  providers: [...services, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule],
})
export class PersonalStorageModule {}
