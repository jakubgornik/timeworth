import { DeleteUserHandler } from './delete-user.handler';
import { PrismaService } from '@packages/db';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserCommand } from './delete-user.command';
import { UserNotFoundException } from '../../exceptions/user.exception';
import { Prisma } from '@packages/db';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let prisma: {
    user: {
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<DeleteUserHandler>(DeleteUserHandler);
    expect(handler).toBeDefined();
  });

  it('should delete user if found', async () => {
    prisma.user.delete.mockResolvedValue({ id: '123' });

    await expect(
      handler.execute(new DeleteUserCommand('123')),
    ).resolves.toBeUndefined();

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('should throw UserNotFoundException if user not found (P2025)', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'No record found',
      {
        code: 'P2025',
        clientVersion: '3.9.0',
      },
    );

    prisma.user.delete.mockRejectedValue(prismaError);

    await expect(
      handler.execute(new DeleteUserCommand('non-existent-id')),
    ).rejects.toThrow(UserNotFoundException);

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
    });
  });
});
