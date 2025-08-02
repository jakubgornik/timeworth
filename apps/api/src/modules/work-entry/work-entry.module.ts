import { Module } from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { WorkEntryController } from './work-entry.controller';
import { CreateWorkEntryHandler } from './commands/create-work-entry/create-work-entry.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';
import { DeleteWorkEntryHandler } from './commands/delete-work-entry/delete-work-entry.handler';
import { GetWorkEntriesHandler } from './query/get-work-entries/get-work-entries.handler';
import { GetOrganizationWorkEntriesHandler } from './query/get-organization-work-entries/get-organization-work-entries.handler';

const services = [WorkEntryService];
const commandHandlers = [
  CreateWorkEntryHandler,
  DeleteWorkEntryHandler,
  GetOrganizationWorkEntriesHandler,
];
const queryHandlers = [GetWorkEntriesHandler];

@Module({
  controllers: [WorkEntryController],
  providers: [...services, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PrismaModule],
})
export class WorkEntryModule {}
