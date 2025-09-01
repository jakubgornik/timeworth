import { Module } from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { WorkEntryController } from './work-entry.controller';
import { CreateWorkEntryHandler } from './commands/create-work-entry/create-work-entry.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';
import { DeleteWorkEntryHandler } from './commands/delete-work-entry/delete-work-entry.handler';
import { GetWorkEntriesHandler } from './query/get-work-entries/get-work-entries.handler';
import { GetOrganizationWorkEntriesHandler } from './query/get-organization-work-entries/get-organization-work-entries.handler';
import { GetFilteredOrganizationWorkEntriesHandler } from './query/get-filtered-organization-work-entries/get-filtered-organization-work-entries.handler';
import { ExportService } from '../export.service';
import { GetExportedWorkEntriesHandler } from './query/get-exported-work-entries/get-exported-work-entries.handler';
import { ImportWorkEntriesService } from './import-work-entries.service';
import { ImportWorkEntriesHandler } from './commands/import-work-entry/import-work-entry.handler';

const services = [WorkEntryService, ExportService, ImportWorkEntriesService];
const commandHandlers = [
  CreateWorkEntryHandler,
  DeleteWorkEntryHandler,
  ImportWorkEntriesHandler,
];
const queryHandlers = [
  GetWorkEntriesHandler,
  GetOrganizationWorkEntriesHandler,
  GetFilteredOrganizationWorkEntriesHandler,
  GetExportedWorkEntriesHandler,
];

@Module({
  controllers: [WorkEntryController],
  providers: [...services, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PrismaModule],
})
export class WorkEntryModule {}
