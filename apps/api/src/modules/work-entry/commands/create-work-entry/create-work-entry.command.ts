import { Command } from '@nestjs/cqrs';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';

export class CreateWorkEntryCommand extends Command<void> {
  constructor(public readonly createWorkEntryDto: CreateWorkEntryDto) {
    super();
  }
}
