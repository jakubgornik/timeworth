import { Command } from '@nestjs/cqrs';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';

export type CreateWorkEntryInput = CreateWorkEntryDto & {
  userId: string;
  organizationId: string;
};

export class CreateWorkEntryCommand extends Command<void> {
  constructor(public readonly createWorkEntryDto: CreateWorkEntryInput) {
    super();
  }
}
