import { Command } from '@nestjs/cqrs';
import { StoredFile } from '@packages/db';

// todo change response
export class ConfirmUploadCommand extends Command<StoredFile> {
  constructor(
    public readonly userId: string,
    public readonly fileId: string,
  ) {
    super();
  }
}
