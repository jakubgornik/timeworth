import { CreateWorkEntryInput } from '../create-work-entry/create-work-entry.command';

export class ImportWorkEntriesCommand {
  constructor(public readonly dto: CreateWorkEntryInput[]) {}
}
