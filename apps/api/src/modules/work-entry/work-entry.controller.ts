import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';

@Controller('work-entry')
export class WorkEntryController {
  constructor(private readonly workEntryService: WorkEntryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getOrganizationUsers(@Query() dto: GetWorkEntriesQueryDto) {
    return await this.workEntryService.getWorkEntries(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createOrganization(@Body() dto: CreateWorkEntryDto) {
    return await this.workEntryService.createWorkEntry(dto);
  }
}
