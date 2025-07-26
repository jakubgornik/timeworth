import { Injectable } from '@nestjs/common';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateWorkEntryCommand } from './commands/create-work-entry/create-work-entry.command';

@Injectable()
export class WorkEntryService {
  constructor(private readonly commandBus: CommandBus) {}

  async createWorkEntry(dto: CreateWorkEntryDto) {
    return await this.commandBus.execute(new CreateWorkEntryCommand(dto));
  }
}
