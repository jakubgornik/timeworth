import { Command } from '@nestjs/cqrs';

export class DeleteFileCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {
    super();
  }
}
