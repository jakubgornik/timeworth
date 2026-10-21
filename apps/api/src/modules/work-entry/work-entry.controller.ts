import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkEntryService } from './work-entry.service';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { OrganizationWorkEntriesFiltersDto } from './dto/organization-work-entries-filters.dto';
import { GetFilteredOrganizationWorkEntriesDto } from '../user/dto/get-filtered-organization-work-entries.dto';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ImportWorkEntriesFileNotFoundException } from './exceptions/work-entry.exceptions';
import { StorageService } from '../storage.service';
import { WORK_ENTRY_TEMPLATE_PATH } from './utils/template.path';
import { ImportFileInterceptor } from './interceptors/import-file.interceptor';
import { RateLimitedUpload } from '../../shared/uploads/upload-rate-limit.guard';

@Controller('work-entry')
export class WorkEntryController {
  constructor(
    private readonly workEntryService: WorkEntryService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @AuthEndpoint()
  async getWorkEntries(
    @Query() dto: GetWorkEntriesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.workEntryService.getWorkEntries(dto, user);
  }

  @Post()
  @AuthEndpoint()
  async createWorkEntry(
    @Body() dto: CreateWorkEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.workEntryService.createWorkEntry(dto, user);
  }

  @Delete(':id')
  @AuthEndpoint()
  async deleteWorkEntry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.workEntryService.deleteWorkEntry(id, user);
  }

  @Get('organization/work-entries')
  @AuthEndpoint()
  async getOrganizationWorkEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search: string,
    @Query() filtersDto: OrganizationWorkEntriesFiltersDto,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.workEntryService.getOrganizationWorkEntries(
      user,
      search,
      paginationDto,
      sortDto,
      filtersDto,
    );
  }

  @Get('filtered')
  @AuthEndpoint()
  async getFilteredWorkEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: GetFilteredOrganizationWorkEntriesDto,
  ) {
    return await this.workEntryService.getFilteredWorkEntries(dto, user);
  }

  @Post('export')
  @AuthEndpoint()
  async exportWorkEntries(
    @Body() filters: OrganizationWorkEntriesFiltersDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const buffer = await this.workEntryService.exportWorkEntries(filters, user);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    res.send(buffer);
  }

  @Get('import-template')
  @AuthEndpoint()
  async downloadWorkEntriesImportTemplate() {
    const downloadUrl = await this.storageService.getPresignedDownloadUrl(
      WORK_ENTRY_TEMPLATE_PATH,
    );
    return { url: downloadUrl };
  }

  @Post('import')
  @RateLimitedUpload(5)
  @UseInterceptors(ImportFileInterceptor)
  async importWorkEntries(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
    @Body('timezone') timezone: string,
  ) {
    if (!file) {
      throw new ImportWorkEntriesFileNotFoundException();
    }
    const userId = user.userId;

    return await this.workEntryService.importWorkEntries(
      file,
      userId,
      timezone,
    );
  }
}
