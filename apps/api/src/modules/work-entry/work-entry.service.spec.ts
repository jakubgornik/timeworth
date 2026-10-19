import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { WorkEntryService } from './work-entry.service';
import { ExportService } from '../export.service';
import { ImportWorkEntriesService } from './import-work-entries.service';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CreateWorkEntryCommand } from './commands/create-work-entry/create-work-entry.command';

describe('WorkEntryService authorization', () => {
  it('should replace client-supplied identity with the authenticated user', async () => {
    const commandBus = { execute: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        WorkEntryService,
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: {} },
        { provide: ExportService, useValue: {} },
        { provide: ImportWorkEntriesService, useValue: {} },
      ],
    }).compile();
    const service = module.get(WorkEntryService);
    const user: AuthenticatedUser = {
      userId: 'user-1',
      email: 'user@example.com',
      role: 'EMPLOYEE',
      organizationId: 'org-1',
      organizationManagerId: 'manager-1',
    };
    const dto = {
      title: 'Work',
      startedAt: new Date('2026-10-19T08:00:00Z'),
      endedAt: new Date('2026-10-19T09:00:00Z'),
      userId: 'another-user',
      organizationId: 'another-organization',
    };

    await service.createWorkEntry(dto, user);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateWorkEntryCommand({
        ...dto,
        userId: 'user-1',
        organizationId: 'org-1',
      }),
    );
  });
});
