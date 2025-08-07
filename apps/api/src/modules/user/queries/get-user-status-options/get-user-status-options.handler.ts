import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserStatus } from '@packages/db';
import { GetUserStatusOptionsQuery } from './get-user-status-options.query';
import { UserStatusOption } from '@packages/types';

@QueryHandler(GetUserStatusOptionsQuery)
export class GetUserStatusOptionsHandler
  implements IQueryHandler<GetUserStatusOptionsQuery, UserStatusOption[]>
{
  async execute(): Promise<UserStatusOption[]> {
    return Object.values(UserStatus).map((status) => ({
      label: this.formatStatusLabel(status),
      value: status,
    }));
  }

  private formatStatusLabel(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'Active';
      case UserStatus.INACTIVE:
        return 'Inactive';
      case UserStatus.AVAILABLE:
        return 'Available';
      case UserStatus.ASSIGNED:
        return 'Assigned';
      case UserStatus.ON_LEAVE:
        return 'On Leave';
      case UserStatus.SUSPENDED:
        return 'Suspended';
      case UserStatus.ARCHIVED:
        return 'Archived';
      default:
        return status;
    }
  }
}
