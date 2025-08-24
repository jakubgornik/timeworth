import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
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
      'public',
      'templates',
      'import-work-entries-template.xlsx',
    );
    return res.download(filePath, 'import-work-entries-template.xlsx');
  }
}
