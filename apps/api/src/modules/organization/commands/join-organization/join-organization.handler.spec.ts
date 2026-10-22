import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { JoinOrganizationHandler } from './join-organization.handler';
import { JoinOrganizationCommand } from './join-organization.command';
import { NotFoundException } from '@nestjs/common';
import { SingleOrganizationLimitFoundException } from '../../exceptions/organization.exception';

describe('JoinOrganizationHandler', () => {
  let handler: JoinOrganizationHandler;
  let prisma: {
    $transaction: jest.Mock;
    organization: { findUnique: jest.Mock };
    user: { findUnique: jest.Mock; updateMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
      organization: { findUnique: jest.fn() },
      user: { findUnique: jest.fn(), updateMany: jest.fn() },
    };

    prisma.$transaction.mockImplementation(async (write) => write(prisma));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinOrganizationHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<JoinOrganizationHandler>(JoinOrganizationHandler);
  });

  it('should throw NotFoundException if invite code is invalid', async () => {
    prisma.organization.findUnique.mockResolvedValue(null);

    const command = new JoinOrganizationCommand({
      userId: 'user-1',
      inviteCode: 'INVALID',
      name: 'John Doe',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new NotFoundException('Invalid invite code'),
    );

    expect(prisma.organization.findUnique).toHaveBeenCalledWith({
      where: { inviteCode: 'INVALID' },
    });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if user is not found', async () => {
    prisma.organization.findUnique.mockResolvedValue({ id: 'org-1' });
    prisma.user.findUnique.mockResolvedValue(null);

    const command = new JoinOrganizationCommand({
      userId: 'user-1',
      inviteCode: 'INVITE123',
      name: 'John Doe',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(prisma.organization.findUnique).toHaveBeenCalledWith({
      where: { inviteCode: 'INVITE123' },
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
  });

  it('should throw a conflict if user already belongs to an organization', async () => {
    prisma.organization.findUnique.mockResolvedValue({ id: 'org-1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      organizationId: 'org-existing',
    });

    const command = new JoinOrganizationCommand({
      userId: 'user-1',
      inviteCode: 'INVITE123',
      name: 'John Doe',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      SingleOrganizationLimitFoundException,
    );

    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('should update user with organizationId, role, and name if valid', async () => {
    prisma.organization.findUnique.mockResolvedValue({ id: 'org-1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      organizationId: null,
    });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    const command = new JoinOrganizationCommand({
      userId: 'user-1',
      inviteCode: 'INVITE123',
      name: 'John Doe',
    });

    await handler.execute(command);

    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: 'user-1', organizationId: null },
      data: {
        organizationId: 'org-1',
        role: 'EMPLOYEE',
        name: 'John Doe',
      },
    });
  });

  it('should return a conflict when another request wins the conditional assignment', async () => {
    prisma.organization.findUnique.mockResolvedValue({ id: 'org-1' });
    prisma.user.findUnique.mockResolvedValue({ organizationId: null });
    prisma.user.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      handler.execute(
        new JoinOrganizationCommand({
          userId: 'user-1',
          inviteCode: 'INVITE123',
          name: 'John Doe',
        }),
      ),
    ).rejects.toMatchObject({ status: 409 });
  });
});
