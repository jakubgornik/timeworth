import { Query } from '@nestjs/cqrs';
import { IUserDto } from '@packages/types';

export class GetUsersQuery extends Query<IUserDto[]> {
  constructor() {
    super();
  }
}
