import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PersonalStorageService } from './personal-storage.service';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ConfirmUploadDto, UploadFilesDto } from './dto/personal-storage.dto';
import { RateLimitedUpload } from '../../shared/uploads/upload-rate-limit.guard';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';

@Controller('personal-storage')
export class PersonalStorageController {
  constructor(
    private readonly personalStorageService: PersonalStorageService,
  ) {}

  @Get()
  @AuthEndpoint()
  async getStorage(
    @CurrentUser() user: AuthenticatedUser,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.personalStorageService.getStorage(
      user.userId,
      paginationDto,
      sortDto,
    );
  }

  @Post('presigned-urls')
  @RateLimitedUpload(10)
  async getUploadUrls(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UploadFilesDto,
  ) {
    return await this.personalStorageService.generateUploadPresignedUrls(
      user.userId,
      body.files,
    );
  }

  @Post('confirm-upload')
  @RateLimitedUpload(120)
  async confirmUpload(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: ConfirmUploadDto,
  ) {
    return await this.personalStorageService.confirmUpload(
      user.userId,
      body.fileId,
    );
  }

  @Delete(':id')
  @AuthEndpoint()
  async deleteFile(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return await this.personalStorageService.deleteFile(user.userId, id);
  }

  @Get(':id/download')
  @AuthEndpoint()
  async getDownloadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return await this.personalStorageService.getDownloadUrl(user.userId, id);
  }
}
