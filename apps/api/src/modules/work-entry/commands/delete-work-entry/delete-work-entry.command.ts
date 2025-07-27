import { Command } from '@nestjs/cqrs';

export class DeleteWorkEntryCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
