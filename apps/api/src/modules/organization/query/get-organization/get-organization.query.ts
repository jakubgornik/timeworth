import { Query } from '@nestjs/cqrs';
import { IOrganizationDto } from '@packages/types';

export class GetOrganizationQuery extends Query<IOrganizationDto> {
  constructor(public readonly managerId: string) {
    super();
  }
}
