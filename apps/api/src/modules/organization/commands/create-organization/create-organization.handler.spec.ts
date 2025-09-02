import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService, UserRole } from '@packages/db';
import { CreateOrganizationHandler } from './create-organization.handler';
import { CreateOrganizationCommand } from './create-organization.command';
import { SingleOrganizationLimitFoundException } from '../../exceptions/organization.exception';
import { Prisma } from '@packages/db';

describe('CreateOrganizationHandler', () => {
  let handler: CreateOrganizationHandler;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrganizationHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<CreateOrganizationHandler>(CreateOrganizationHandler);

    jest
      .spyOn(handler as any, 'generateInviteCode')
      .mockReturnValue('ABCD1234');
  });

  it('should create organization and assign manager', async () => {
    const dto = { name: 'Org1', managerId: 'user-123' };

    const mockTx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        update: jest.fn(),
      },
      organization: { create: jest.fn().mockResolvedValue({ id: 'org-1' }) },
    };

    prisma.$transaction.mockImplementation(async (tx) => tx(mockTx));

    await handler.execute(new CreateOrganizationCommand(dto));

    expect(mockTx.user.findUnique).toHaveBeenCalledWith({
      where: { id: dto.managerId },
    });
    expect(mockTx.organization.create).toHaveBeenCalledWith({
      data: { ...dto, inviteCode: 'ABCD1234' },
    });
    expect(mockTx.user.update).toHaveBeenCalledWith({
      where: { id: dto.managerId },
      data: { organizationId: 'org-1', role: UserRole.MANAGER },
    });
  });

  it('should throw SingleOrganizationLimitFoundException if user already has org', async () => {
    const dto = { name: 'Org1', managerId: 'user-123' };

    const mockTx = {
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ organizationId: 'org-existing' }),
        update: jest.fn(),
      },
      organization: { create: jest.fn() },
    };

    prisma.$transaction.mockImplementation(async (tx) => tx(mockTx));

    await expect(
      handler.execute(new CreateOrganizationCommand(dto)),
    ).rejects.toThrow(SingleOrganizationLimitFoundException);

    expect(mockTx.organization.create).not.toHaveBeenCalled();
    expect(mockTx.user.update).not.toHaveBeenCalled();
  });

  it('should retry on inviteCode conflict (P2002)', async () => {
    const dto = { name: 'Org1', managerId: 'user-123' };
    const p2002Error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: { target: ['inviteCode'] },
      },
    );

    const mockTx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        update: jest.fn(),
      },
      organization: {
        create: jest
          .fn()
          .mockRejectedValueOnce(p2002Error)
          .mockResolvedValue({ id: 'org-1' }),
      },
    };

    prisma.$transaction.mockImplementation(async (tx) => {
      return tx(mockTx);
    });

    await handler.execute(new CreateOrganizationCommand(dto));

    expect(mockTx.organization.create).toHaveBeenCalledTimes(2);
    expect(mockTx.user.update).toHaveBeenCalledWith({
      where: { id: dto.managerId },
      data: { organizationId: 'org-1', role: UserRole.MANAGER },
    });
  });
});
