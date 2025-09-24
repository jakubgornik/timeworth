import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
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
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../user/user.controller';
import { ImportWorkEntriesFileNotFoundException } from './exceptions/work-entry.exceptions';
import * as fs from 'fs';

@Controller('work-entry')
export class WorkEntryController {
  constructor(private readonly workEntryService: WorkEntryService) {}

  @Get()
  @AuthEndpoint()
  async getWorkEntries(@Query() dto: GetWorkEntriesQueryDto) {
    return await this.workEntryService.getWorkEntries(dto);
  }

  @Post()
  @AuthEndpoint()
  async createWorkEntry(@Body() dto: CreateWorkEntryDto) {
    return await this.workEntryService.createWorkEntry(dto);
  }

  @Delete(':id')
  @AuthEndpoint()
  async deleteWorkEntry(@Param('id') id: string) {
    return await this.workEntryService.deleteWorkEntry(id);
  }

  @Get('organization/work-entries')
  @AuthEndpoint()
  async getOrganizationWorkEntries(
    @Query('managerId') managerId: string,
    @Query('search') search: string,
    @Query() filtersDto: OrganizationWorkEntriesFiltersDto,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.workEntryService.getOrganizationWorkEntries(
      managerId,
      search,
      paginationDto,
      sortDto,
      filtersDto,
    );
  }

  @Get('filtered')
  @AuthEndpoint()
  async getFilteredWorkEntries(
    @Query('managerId') managerId: string,
    @Query() dto: GetFilteredOrganizationWorkEntriesDto,
  ) {
    return await this.workEntryService.getFilteredWorkEntries(dto, managerId);
  }

  @Post('export')
  @AuthEndpoint()
  async exportWorkEntries(
    @Body() filters: OrganizationWorkEntriesFiltersDto,
    @Res() res: Response,
  ) {
    const buffer = await this.workEntryService.exportWorkEntries(filters);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    res.send(buffer);
  }

  @Get('import-template')
  @AuthEndpoint()
  downloadWorkEntriesImportTemplate(@Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'dist',
      'public',
      'templates',
      'import-work-entries-template.xlsx',
    );

    // DEBUG
    console.log('process.cwd():', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('Resolved file path:', filePath);

    const exists = fs.existsSync(filePath);
    console.log('File exists?', exists);

    return res.download(filePath, 'import-work-entries-template.xlsx');
  }

  @Post('import')
  @AuthEndpoint()
  @UseInterceptors(FileInterceptor('file'))
  async importWorkEntries(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new ImportWorkEntriesFileNotFoundException();
    }
    const userId = req.user.userId;
    const timezone = req.body.timezone;

    return await this.workEntryService.importWorkEntries(
      file,
      userId,
      timezone,
    );
  }
}
