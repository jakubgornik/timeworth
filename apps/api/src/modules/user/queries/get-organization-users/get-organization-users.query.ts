import { Query } from '@nestjs/cqrs';
import {
  ICurrentUserDto as IUserDto,
  PaginatedResponse,
} from '@packages/types';
import { OrganizationUsersQueryDto } from '../../dto/organization-users.dto';

export class GetOrganizationUsersQuery extends Query<
  PaginatedResponse<IUserDto>[]
> {
  constructor(
    public readonly organizationUsersQueryDto: OrganizationUsersQueryDto,
  ) {
    super();
  }
}
