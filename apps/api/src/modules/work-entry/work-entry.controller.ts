import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';

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

  @Get('protected')
  @AuthEndpoint()
  getProtectedResource() {
    return { message: 'This route is protected' };
  }
}
