import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';

export type ImportWorkEntryInput = CreateWorkEntryDto & {
  userId: string;
};

export class ImportWorkEntriesCommand {
  constructor(public readonly dto: ImportWorkEntryInput[]) {}
}
