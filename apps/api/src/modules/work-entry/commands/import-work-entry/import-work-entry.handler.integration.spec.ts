import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { ImportWorkEntriesHandler } from './import-work-entry.handler';
import { ImportWorkEntriesCommand } from './import-work-entry.command';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';
import { BadRequestException } from '@nestjs/common';

describe('ImportWorkEntriesHandler Integration Test', () => {
  let handler: ImportWorkEntriesHandler;
  let prisma: PrismaService;

  let testUserId: string;
  const TEST_TAG = 'INTEGRATION_TEST_IMPORT_CLEANUP_TAG';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportWorkEntriesHandler, PrismaService],
    }).compile();

    handler = module.get<ImportWorkEntriesHandler>(ImportWorkEntriesHandler);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.findFirst({
      where: {
        organizationId: { not: null },
      },
    });

    if (!user) {
      throw new Error('Seeded data missing! Please run your seed script.');
    }

    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.workEntry.deleteMany({
      where: { description: TEST_TAG },
    });

    await prisma.$disconnect();
  });

  it('should successfully bulk import work entries', async () => {
    const dtos: CreateWorkEntryDto[] = [
      {
        title: 'Bulk Import Entry 1',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        description: TEST_TAG,
        userId: testUserId,
        organizationId: '',
      },
      {
        title: 'Bulk Import Entry 2',
        startedAt: new Date('2025-01-02T09:00:00Z'),
        endedAt: new Date('2025-01-02T11:00:00Z'),
        description: TEST_TAG,
        userId: testUserId,
        organizationId: '',
      },
    ];

    const command = new ImportWorkEntriesCommand(dtos);
    const result = await handler.execute(command);

    expect(result).toEqual({ count: 2 });

    const workEntries = await prisma.workEntry.findMany({
      where: { description: TEST_TAG },
      orderBy: { startedAt: 'asc' },
    });

    expect(workEntries.length).toBe(2);
    expect(workEntries[0].organizationId).toBeTruthy();
    expect(workEntries[0].organizationId).toBe(workEntries[1].organizationId);
    expect(workEntries[0].hoursWorked).toBe(4);
    expect(workEntries[1].hoursWorked).toBe(2);
  });

  it('should throw a BadRequestException if a user does not exist', async () => {
    const dtos: CreateWorkEntryDto[] = [
      {
        title: 'Bad Bulk Entry',
        startedAt: new Date('2025-01-01T08:00:00Z'),
        endedAt: new Date('2025-01-01T12:00:00Z'),
        description: TEST_TAG,
        userId: '123',
        organizationId: '',
      },
    ];

    const command = new ImportWorkEntriesCommand(dtos);

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(command)).rejects.toThrow(
      'Cannot find organization for user 123',
    );
  });
});
