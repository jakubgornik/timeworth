import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PersonalStorageService } from './personal-storage.service';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { RequestWithUser } from '../user/user.controller';
import { ConfirmUploadDto, FileMetadataDto } from './dto/personal-storage.dto';
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
    @Req() req: RequestWithUser,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.personalStorageService.getStorage(
      req.user.userId,
      paginationDto,
      sortDto,
    );
  }

  @Post('presigned-urls')
  @AuthEndpoint()
  async getUploadUrls(
    @Req() req: RequestWithUser,
    @Body() files: FileMetadataDto[],
  ) {
    return await this.personalStorageService.generateUploadPresignedUrls(
      req.user.userId,
      files,
    );
  }

  @Post('confirm-upload')
  @AuthEndpoint()
  async confirmUpload(
    @Req() req: RequestWithUser,
    @Body() body: ConfirmUploadDto,
  ) {
    return await this.personalStorageService.confirmUpload(
      req.user.userId,
      body.fileId,
    );
  }

  @Delete(':id')
  @AuthEndpoint()
  async deleteFile(@Req() req: RequestWithUser, @Param('id') id: string) {
    return await this.personalStorageService.deleteFile(req.user.userId, id);
  }

  @Get(':id/download')
  @AuthEndpoint()
  async getDownloadUrl(@Req() req: RequestWithUser, @Param('id') id: string) {
    return await this.personalStorageService.getDownloadUrl(
      req.user.userId,
      id,
    );
  }
}
