import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { DeleteWorkEntryHandler } from './delete-work-entry.handler';
import { DeleteWorkEntryCommand } from './delete-work-entry.command';

describe('DeleteWorkEntryHandler', () => {
  let handler: DeleteWorkEntryHandler;
  let prisma: {
    workEntry: {
      deleteMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      workEntry: {
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteWorkEntryHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<DeleteWorkEntryHandler>(DeleteWorkEntryHandler);
    expect(handler).toBeDefined();
  });

  it('should delete work entry if found', async () => {
    prisma.workEntry.deleteMany.mockResolvedValue({ count: 1 });

    await expect(
      handler.execute(
        new DeleteWorkEntryCommand('work-123', 'user-123', 'org-123'),
      ),
    ).resolves.toBeUndefined();

    expect(prisma.workEntry.deleteMany).toHaveBeenCalledWith({
      where: { id: 'work-123', userId: 'user-123', organizationId: 'org-123' },
    });
  });

  it('should throw not found when no entry matches the ownership scope', async () => {
    prisma.workEntry.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      handler.execute(
        new DeleteWorkEntryCommand('foreign-entry', 'user-123', 'org-123'),
      ),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.workEntry.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 'foreign-entry',
        userId: 'user-123',
        organizationId: 'org-123',
      },
    });
  });
});
