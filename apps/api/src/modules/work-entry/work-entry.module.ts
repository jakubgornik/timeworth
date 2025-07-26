import { Module } from '@nestjs/common';
import { WorkEntryService } from './work-entry.service';
import { WorkEntryController } from './work-entry.controller';
import { CreateWorkEntryHandler } from './commands/create-work-entry/create-work-entry.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';

const services = [WorkEntryService];

const commandHandlers = [CreateWorkEntryHandler];

@Module({
  controllers: [WorkEntryController],
  providers: [...services, ...commandHandlers],
  imports: [CqrsModule, PrismaModule],
})
export class WorkEntryModule {}
