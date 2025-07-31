import { Query } from '@nestjs/cqrs';
import { ICurrentUserDto } from '@packages/types';

export class GetUserByIdQuery extends Query<ICurrentUserDto> {
  constructor(public readonly userId: string) {
    super();
  }
}
