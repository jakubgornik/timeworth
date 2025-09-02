import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { CreateWorkEntryHandler } from './create-work-entry.handler';
import { CreateWorkEntryCommand } from './create-work-entry.command';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';
import { WorkEntryStartedAtBeforeEndedAt } from '../../exceptions/work-entry.exceptions';

describe('CreateWorkEntryHandler', () => {
  let handler: CreateWorkEntryHandler;
  let prisma: { workEntry: { create: jest.Mock } };

  const calcHoursWorked = (startedAt: Date, endedAt: Date) =>
    (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

  beforeEach(async () => {
    prisma = {
      workEntry: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWorkEntryHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<CreateWorkEntryHandler>(CreateWorkEntryHandler);
  });

  it('should create a work entry with correct hoursWorked', async () => {
    const dto: CreateWorkEntryDto = {
      title: 'Test Work',
      startedAt: new Date('2025-01-01T08:00:00Z'),
      endedAt: new Date('2025-01-01T12:00:00Z'),
      description: 'Worked on something',
      userId: 'user-123',
      organizationId: 'org-123',
    };

    const command = new CreateWorkEntryCommand(dto);
    const expectedHoursWorked = calcHoursWorked(dto.startedAt, dto.endedAt);

    prisma.workEntry.create.mockResolvedValue({
      id: 'we1',
      ...dto,
      hoursWorked: expectedHoursWorked,
    });

    await handler.execute(command);

    expect(prisma.workEntry.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        hoursWorked: expectedHoursWorked,
      },
    });
  });

  it('should throw error if started at is before ended at', async () => {
    const dto: CreateWorkEntryDto = {
      title: 'Test Work',
      startedAt: new Date('2025-01-01T12:00:00Z'),
      endedAt: new Date('2025-01-01T08:00:00Z'),
      userId: 'user-123',
      organizationId: 'org-123',
    };

    const command = new CreateWorkEntryCommand(dto);

    await expect(handler.execute(command)).rejects.toThrow(
      WorkEntryStartedAtBeforeEndedAt,
    );
  });
});
