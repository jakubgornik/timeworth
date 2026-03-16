import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { CreateWorkEntryHandler } from './create-work-entry.handler';
import { CreateWorkEntryCommand } from './create-work-entry.command';
import { CreateWorkEntryDto } from '../../dto/create-work-entry.dto';

describe('CreateWorkEntryHandler Integration Test', () => {
  let handler: CreateWorkEntryHandler;
  let prisma: PrismaService;

  let testUserId: string;
  let testOrgId: string;
  let createdWorkEntryId: string | undefined;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateWorkEntryHandler, PrismaService],
    }).compile();

    handler = module.get<CreateWorkEntryHandler>(CreateWorkEntryHandler);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
    });
    const organization = await prisma.organization.findFirst({
      where: { name: 'DemoCorp Inc.' },
    });

    if (!user || !organization) {
      throw new Error(
        'Seeded data missing! Please run your seed script before testing.',
      );
    }

    testUserId = user.id;
    testOrgId = organization.id;
  });

  afterAll(async () => {
    if (createdWorkEntryId) {
      await prisma.workEntry.delete({
        where: { id: createdWorkEntryId },
      });
    }

    await prisma.$disconnect();
  });

  it('should successfully save a work entry to the seeded database', async () => {
    const dto: CreateWorkEntryDto = {
      title: 'Test Work Entry',
      startedAt: new Date('2025-01-01T08:00:00Z'),
      endedAt: new Date('2025-01-01T12:00:00Z'),
      description: 'Test',
      userId: testUserId,
      organizationId: testOrgId,
    };
    const command = new CreateWorkEntryCommand(dto);

    await handler.execute(command);

    const savedEntry = await prisma.workEntry.findFirst({
      where: {
        title: dto.title,
        userId: testUserId,
      },
    });

    expect(savedEntry).not.toBeNull();
    expect(savedEntry?.title).toBe(dto.title);
    expect(savedEntry?.hoursWorked).toBe(4);

    createdWorkEntryId = savedEntry?.id;
  });
});
