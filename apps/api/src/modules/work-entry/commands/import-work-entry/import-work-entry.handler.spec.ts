import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { ImportWorkEntriesHandler } from './import-work-entry.handler';
import { ImportWorkEntriesCommand } from './import-work-entry.command';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';
import { BadRequestException } from '@nestjs/common';

const calcHoursWorked = (startedAt: Date, endedAt: Date) =>
  (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

describe('ImportWorkEntriesHandler', () => {
  let handler: ImportWorkEntriesHandler;
  let prisma: {
    user: { findUnique: jest.Mock };
    workEntry: { createMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      workEntry: { createMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportWorkEntriesHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<ImportWorkEntriesHandler>(ImportWorkEntriesHandler);
  });

  it('should import multiple work entries with correct hoursWorked', async () => {
    const dto: CreateWorkEntryDto[] = [
      {
        title: 'Entry 1',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        description: 'First entry',
        userId: 'user-1',
        organizationId: '',
      },
      {
        title: 'Entry 2',
        startedAt: new Date('2025-01-02T09:00:00Z'),
        endedAt: new Date('2025-01-02T17:00:00Z'),
        description: 'Second entry',
        userId: 'user-2',
        organizationId: '',
      },
    ];

    prisma.user.findUnique
      .mockResolvedValueOnce({ organizationId: 'org-1' })
      .mockResolvedValueOnce({ organizationId: 'org-2' });

    prisma.workEntry.createMany.mockResolvedValue({ count: 2 });

    const command = new ImportWorkEntriesCommand(dto);
    const result = await handler.execute(command);

    const expectedData = dto.map((entry, idx) => ({
      title: entry.title,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      description: entry.description ?? '',
      hoursWorked: calcHoursWorked(entry.startedAt, entry.endedAt),
      userId: entry.userId,
      organizationId: `org-${idx + 1}`,
    }));

    expect(prisma.workEntry.createMany).toHaveBeenCalledWith({
      data: expectedData,
    });
    expect(result).toEqual({ count: 2 });
  });

  it('should throw BadRequestException if user has no organization', async () => {
    const dto: CreateWorkEntryDto[] = [
      {
        title: 'Invalid Entry',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        userId: 'user-99',
        organizationId: '',
      },
    ];

    prisma.user.findUnique.mockResolvedValue(null);

    const command = new ImportWorkEntriesCommand(dto);

    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException('Cannot find organization for user user-99'),
    );

    expect(prisma.workEntry.createMany).not.toHaveBeenCalled();
  });
});
