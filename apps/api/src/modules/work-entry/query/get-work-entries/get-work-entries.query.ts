import { Query } from '@nestjs/cqrs';
import { IWorkEntryToEventDto } from '@packages/types';
import { GetWorkEntriesQueryDto } from '../../dto/get-work-entries.dto';

export class GetWorkEntriesQuery extends Query<IWorkEntryToEventDto[]> {
  constructor(
    public readonly getWorkEntriesQueryDto: GetWorkEntriesQueryDto,
    public readonly userId: string,
    public readonly organizationId: string,
  ) {
    super();
  }
}
