import { Query } from '@nestjs/cqrs';
import { OrganizationWorkEntriesFiltersDto } from '../../dto/organization-work-entries-filters.dto';
import { IWorkEntryDto } from '@packages/types';

export class GetExportedWorkEntriesQuery extends Query<IWorkEntryDto[]> {
  constructor(public readonly filtersDto: OrganizationWorkEntriesFiltersDto) {
    super();
  }
}
