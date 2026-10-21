import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { UploadRateLimitGuard } from '../shared/uploads/upload-rate-limit.guard';

@Module({
  imports: [ConfigModule],
  providers: [StorageService, UploadRateLimitGuard],
  exports: [StorageService, UploadRateLimitGuard],
})
export class StorageModule {}
