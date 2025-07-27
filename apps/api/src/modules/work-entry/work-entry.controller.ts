import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';

@Controller('work-entry')
export class WorkEntryController {
  constructor(private readonly workEntryService: WorkEntryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getWorkEntries(@Query() dto: GetWorkEntriesQueryDto) {
    return await this.workEntryService.getWorkEntries(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createWorkEntry(@Body() dto: CreateWorkEntryDto) {
    return await this.workEntryService.createWorkEntry(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteWorkEntry(@Param('id') id: string) {
    return await this.workEntryService.deleteWorkEntry(id);
  }
}
