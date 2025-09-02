import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { DeleteWorkEntryHandler } from './delete-work-entry.handler';
import { DeleteWorkEntryCommand } from './delete-work-entry.command';

describe('DeleteWorkEntryHandler', () => {
  let handler: DeleteWorkEntryHandler;
  let prisma: {
    workEntry: {
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      workEntry: {
        delete: jest.fn(),
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
    prisma.workEntry.delete.mockResolvedValue({ id: 'work-123' });

    await expect(
      handler.execute(new DeleteWorkEntryCommand('work-123')),
    ).resolves.toBeUndefined();

    expect(prisma.workEntry.delete).toHaveBeenCalledWith({
      where: { id: 'work-123' },
    });
  });
});
