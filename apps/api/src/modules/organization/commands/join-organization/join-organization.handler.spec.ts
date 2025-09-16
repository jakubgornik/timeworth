import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { JoinOrganizationHandler } from './join-organization.handler';
import { JoinOrganizationCommand } from './join-organization.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('JoinOrganizationHandler', () => {
  let handler: JoinOrganizationHandler;
  let prisma: {
    organization: { findUnique: jest.Mock };
    user: { findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      organization: { findUnique: jest.fn() },
      user: { findUnique: jest.fn(), update: jest.fn() },
    };

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
      include: { organization: true },
    });
  });

  it('should throw BadRequestException if user already belongs to an organization', async () => {
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
      new BadRequestException('User is already a member of an organization'),
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should update user with organizationId, role, and name if valid', async () => {
    prisma.organization.findUnique.mockResolvedValue({ id: 'org-1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      organizationId: null,
    });
    prisma.user.update.mockResolvedValue({ id: 'user-1' });

    const command = new JoinOrganizationCommand({
      userId: 'user-1',
      inviteCode: 'INVITE123',
      name: 'John Doe',
    });

    await handler.execute(command);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        organizationId: 'org-1',
        role: 'EMPLOYEE',
        name: 'John Doe',
      },
    });
  });
});
