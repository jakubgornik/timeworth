import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { ImportWorkEntriesHandler } from './import-work-entry.handler';
import {
  ImportWorkEntriesCommand,
  ImportWorkEntryInput,
} from './import-work-entry.command';
import { BadRequestException } from '@nestjs/common';

const calcHoursWorked = (startedAt: Date, endedAt: Date) =>
  (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

describe('ImportWorkEntriesHandler', () => {
  let handler: ImportWorkEntriesHandler;
  let prisma: {
    $transaction: jest.Mock;
    user: { findMany: jest.Mock };
    workEntry: { createMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
      user: { findMany: jest.fn() },
      workEntry: { createMany: jest.fn() },
    };
    prisma.$transaction.mockImplementation((operation) => operation(prisma));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportWorkEntriesHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<ImportWorkEntriesHandler>(ImportWorkEntriesHandler);
  });

  it('should import multiple work entries with correct hoursWorked', async () => {
    const dto: ImportWorkEntryInput[] = [
      {
        title: 'Entry 1',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        description: 'First entry',
        userId: 'user-1',
      },
      {
        title: 'Entry 2',
        startedAt: new Date('2025-01-02T09:00:00Z'),
        endedAt: new Date('2025-01-02T17:00:00Z'),
        description: 'Second entry',
        userId: 'user-2',
      },
    ];

    prisma.user.findMany.mockResolvedValue([
      { id: 'user-1', organizationId: 'org-1' },
      { id: 'user-2', organizationId: 'org-2' },
    ]);

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
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { id: { in: ['user-1', 'user-2'] } },
      select: { id: true, organizationId: true },
    });
    expect(dto.every((entry) => !('organizationId' in entry))).toBe(true);
  });

  it('should throw BadRequestException if user has no organization', async () => {
    const dto: ImportWorkEntryInput[] = [
      {
        title: 'Invalid Entry',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        userId: 'user-99',
      },
    ];

    prisma.user.findMany.mockResolvedValue([]);

    const command = new ImportWorkEntriesCommand(dto);

    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException('Cannot find organization for user user-99'),
    );

    expect(prisma.workEntry.createMany).not.toHaveBeenCalled();
  });

  it.each([1, 100, 10_000])(
    'uses one lookup and one bulk write for %i rows belonging to one actor',
    async (count) => {
      const dto = Array.from({ length: count }, (_, index) => ({
        title: `Entry ${index}`,
        startedAt: new Date('2026-01-01T08:00:00Z'),
        endedAt: new Date('2026-01-01T09:00:00Z'),
        userId: 'user-1',
        organizationId: 'client-supplied-organization',
      }));
      prisma.user.findMany.mockResolvedValue([
        { id: 'user-1', organizationId: 'org-1' },
      ]);
      prisma.workEntry.createMany.mockResolvedValue({ count });
      await expect(
        handler.execute(new ImportWorkEntriesCommand(dto)),
      ).resolves.toEqual({ count });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['user-1'] } },
        select: { id: true, organizationId: true },
      });
      expect(prisma.workEntry.createMany).toHaveBeenCalledTimes(1);
      const data = prisma.workEntry.createMany.mock.calls[0][0].data as {
        organizationId: string;
      }[];
      expect(data).toHaveLength(count);
      expect(data.every((entry) => entry.organizationId === 'org-1')).toBe(
        true,
      );
      expect(dto[0].organizationId).toBe('client-supplied-organization');
    },
  );

  it('validates every user before writing any entries', async () => {
    const entry = {
      title: 'Work',
      startedAt: new Date('2026-01-01T08:00:00Z'),
      endedAt: new Date('2026-01-01T09:00:00Z'),
    };
    prisma.user.findMany.mockResolvedValue([
      { id: 'user-1', organizationId: 'org-1' },
      { id: 'user-2', organizationId: null },
    ]);
    await expect(
      handler.execute(
        new ImportWorkEntriesCommand([
          { ...entry, userId: 'user-1' },
          { ...entry, userId: 'user-2' },
        ]),
      ),
    ).rejects.toThrow('Cannot find organization for user user-2');
    expect(prisma.workEntry.createMany).not.toHaveBeenCalled();
  });

  it('does not access the database for an empty batch', async () => {
    await expect(
      handler.execute(new ImportWorkEntriesCommand([])),
    ).resolves.toEqual({ count: 0 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('uses the transaction client for both the organization lookup and write', async () => {
    const tx = {
      user: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: 'user-1', organizationId: 'org-1' }]),
      },
      workEntry: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    prisma.$transaction.mockImplementation((operation) => operation(tx));
    await handler.execute(
      new ImportWorkEntriesCommand([
        {
          title: 'Work',
          startedAt: new Date('2026-01-01T08:00:00Z'),
          endedAt: new Date('2026-01-01T09:00:00Z'),
          userId: 'user-1',
        },
      ]),
    );
    expect(tx.user.findMany).toHaveBeenCalledTimes(1);
    expect(tx.workEntry.createMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(prisma.workEntry.createMany).not.toHaveBeenCalled();
  });
});
