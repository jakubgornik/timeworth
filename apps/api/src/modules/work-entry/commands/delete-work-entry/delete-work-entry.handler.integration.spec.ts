import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { DeleteWorkEntryHandler } from './delete-work-entry.handler';
import { DeleteWorkEntryCommand } from './delete-work-entry.command';

describe('DeleteWorkEntryHandler Integration Test', () => {
  let handler: DeleteWorkEntryHandler;
  let prisma: PrismaService;

  let testUserId: string;
  let testOrgId: string;
  let tempEntryId: string | undefined;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteWorkEntryHandler, PrismaService],
    }).compile();

    handler = module.get<DeleteWorkEntryHandler>(DeleteWorkEntryHandler);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
    });
    const organization = await prisma.organization.findFirst({
      where: { name: 'DemoCorp Inc.' },
    });

    if (!user || !organization) {
      throw new Error('Seeded data missing! Please run your seed script.');
    }

    testUserId = user.id;
    testOrgId = organization.id;
  });

  afterAll(async () => {
    if (tempEntryId) {
      try {
        await prisma.workEntry.delete({
          where: { id: tempEntryId },
        });
      } catch (error) {
        // If the entry was already deleted during the test, we can ignore this error
      }
    }

    await prisma.$disconnect();
  });

  it('should successfully delete an existing work entry from the database', async () => {
    const workEntry = await prisma.workEntry.create({
      data: {
        title: 'Entry to be deleted',
        description: 'cleanup target',
        startedAt: new Date('2025-01-02T08:00:00Z'),
        endedAt: new Date('2025-01-02T12:00:00Z'),
        hoursWorked: 4,
        userId: testUserId,
        organizationId: testOrgId,
      },
    });
    tempEntryId = workEntry.id;

    const command = new DeleteWorkEntryCommand(workEntry.id);
    await handler.execute(command);

    const deletedEntry = await prisma.workEntry.findUnique({
      where: { id: tempEntryId },
    });

    expect(deletedEntry).toBeNull();
  });

  it('should throw an error if the work entry ID does not exist', async () => {
    const command = new DeleteWorkEntryCommand('123');

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
