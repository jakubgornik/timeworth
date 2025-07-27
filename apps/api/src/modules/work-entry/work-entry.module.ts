import { Module } from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { WorkEntryController } from './work-entry.controller';
import { CreateWorkEntryHandler } from './commands/create-work-entry/create-work-entry.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';
import { GetWorkEntriesHandler } from './query/get-work-entries.handler';
import { DeleteWorkEntryHandler } from './commands/delete-work-entry/delete-work-entry.handler';

const services = [WorkEntryService];
const commandHandlers = [CreateWorkEntryHandler, DeleteWorkEntryHandler];
const queryHandlers = [GetWorkEntriesHandler];

@Module({
  controllers: [WorkEntryController],
  providers: [...services, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PrismaModule],
})
export class WorkEntryModule {}
