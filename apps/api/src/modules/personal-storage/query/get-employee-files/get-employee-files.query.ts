import { Query } from '@nestjs/cqrs';
import { StoredFile } from '@packages/db';

// todo change response
export class GetEmployeeFilesQuery extends Query<StoredFile[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
