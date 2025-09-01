import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';

export class ImportWorkEntriesCommand {
  constructor(public readonly dto: CreateWorkEntryDto[]) {}
}
