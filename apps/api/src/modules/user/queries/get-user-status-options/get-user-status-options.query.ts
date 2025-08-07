import { Query } from '@nestjs/cqrs';
import { UserStatusOption } from '@packages/types';

export class GetUserStatusOptionsQuery extends Query<UserStatusOption[]> {
  constructor() {
    super();
  }
}
