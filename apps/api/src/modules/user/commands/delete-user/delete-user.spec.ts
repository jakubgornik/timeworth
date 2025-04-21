import { DeleteUserHandler } from './delete-user.handler';
import { PrismaService } from '@packages/db';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserCommand } from './delete-user.command';
import { UserNotFoundException } from '../../exceptions/user.exception';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
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
  });

  it('should delete user if found', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '123' });

    await expect(
      handler.execute(new DeleteUserCommand('123')),
    ).resolves.toBeUndefined();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(handler.execute(new DeleteUserCommand(''))).rejects.toThrow(
      UserNotFoundException,
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '' },
    });
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });
});
