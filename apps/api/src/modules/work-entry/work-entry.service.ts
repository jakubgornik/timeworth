import { Injectable } from '@nestjs/common';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkEntryCommand } from './commands/create-work-entry/create-work-entry.command';
import { GetWorkEntriesQuery } from './query/get-work-entries.query';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';

@Injectable()
export class WorkEntryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getWorkEntries(dto: GetWorkEntriesQueryDto) {
    return await this.queryBus.execute(new GetWorkEntriesQuery(dto));
  }

  async createWorkEntry(dto: CreateWorkEntryDto) {
    return await this.commandBus.execute(new CreateWorkEntryCommand(dto));
  }
}
