import { Query } from '@nestjs/cqrs';
import { SelectedUser } from '@packages/types';

export class GetListedOrganizationUsersQuery extends Query<SelectedUser[]> {
  constructor(public readonly organizationId: string) {
    super();
  }
}
