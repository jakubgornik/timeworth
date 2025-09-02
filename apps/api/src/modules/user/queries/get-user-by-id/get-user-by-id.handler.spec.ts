import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserNotFoundException } from '../../exceptions/user.exception';
import { ICurrentUserDto } from '@packages/types';

describe('GetUserByIdHandler', () => {
  let handler: GetUserByIdHandler;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<GetUserByIdHandler>(GetUserByIdHandler);
    expect(handler).toBeDefined();
  });

  it('should return user if found', async () => {
    const mockUser: ICurrentUserDto = {
      id: '123',
      email: 'test@example.com',
      name: 'John Doe',
      status: 'ACTIVE',
      organization: {
        id: 'org-1',
        name: 'Test Org',
        managerId: 'manager-1',
      },
      role: 'MANAGER',
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await handler.execute(new GetUserByIdQuery('123'));

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        organization: {
          select: {
            id: true,
            name: true,
            managerId: true,
          },
        },
        role: true,
      },
    });
  });

  it('should throw UserNotFoundException if user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      handler.execute(new GetUserByIdQuery('non-existent-id')),
    ).rejects.toThrow(UserNotFoundException);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        organization: {
          select: {
            id: true,
            name: true,
            managerId: true,
          },
        },
        role: true,
      },
    });
  });
});
