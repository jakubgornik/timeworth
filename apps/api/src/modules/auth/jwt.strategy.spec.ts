import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: { user: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn() } };
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: new ConfigService({
            JWT_SECRET: 'authorization-test-secret',
          }),
        },
      ],
    }).compile();
    strategy = module.get(JwtStrategy);
  });

  it('should derive role and membership from the database instead of JWT claims', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'current@example.com',
      role: 'EMPLOYEE',
      organization: { id: 'org-1', managerId: 'manager-1' },
    });
    const payload = { sub: 'user-1', role: 'MANAGER', organizationId: 'org-2' };

    await expect(strategy.validate(payload)).resolves.toEqual({
      userId: 'user-1',
      email: 'current@example.com',
      role: 'EMPLOYEE',
      organizationId: 'org-1',
      organizationManagerId: 'manager-1',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'user-1' } }),
    );
  });

  it('should reject a token whose user no longer exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(strategy.validate({ sub: 'deleted-user' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
