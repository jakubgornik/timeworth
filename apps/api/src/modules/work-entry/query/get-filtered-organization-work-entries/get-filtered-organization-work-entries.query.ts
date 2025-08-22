import { Query } from '@nestjs/cqrs';
import { IWorkEntryDtoWithUser } from '@packages/types';
import { GetFilteredOrganizationWorkEntriesDto } from 'src/modules/user/dto/get-filtered-organization-work-entries.dto';

export class GetFilteredOrganizationWorkEntriesQuery extends Query<
  IWorkEntryDtoWithUser[]
> {
  constructor(
    public readonly dto: GetFilteredOrganizationWorkEntriesDto,
    public readonly managerId: string,
  ) {
    super();
  }
}
