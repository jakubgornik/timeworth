import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PersonalStorageService } from './personal-storage.service';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { RequestWithUser } from '../user/user.controller';
import { ConfirmUploadDto, FileMetadataDto } from './dto/personal-storage.dto';

@Controller('personal-storage')
export class PersonalStorageController {
  constructor(
    private readonly personalStorageService: PersonalStorageService,
  ) {}

  @Get()
  @AuthEndpoint()
  async getEmployeeFiles(@Req() req: RequestWithUser) {
    return await this.personalStorageService.getEmployeeFiles(req.user.userId);
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
}
