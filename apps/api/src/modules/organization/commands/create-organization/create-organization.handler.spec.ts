import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService, UserRole } from '@packages/db';
import { CreateOrganizationHandler } from './create-organization.handler';
import { CreateOrganizationCommand } from './create-organization.command';
import {
  SingleOrganizationLimitFoundException,
  OrganizationNameAlreadyExistsException,
} from '../../exceptions/organization.exception';

const mockedDto1 = {
  organizationName: 'Test Organization',
  managerName: 'John Manager',
  managerId: 'user-123',
  industry: 'Technology',
  size: 'Medium',
  address: '123 Business St',
};

const mockedDto2 = {
  organizationName: 'Existing Organization',
  managerName: 'John Manager',
  managerId: 'user-123',
  industry: 'Technology',
  size: 'Medium',
  address: '123 Business St',
};

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

  it('should create organization and assign manager with updated name', async () => {
    const mockTx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      organization: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'org-1' }),
      },
    };

    prisma.$transaction.mockImplementation(async (tx) => tx(mockTx));

    await handler.execute(new CreateOrganizationCommand(mockedDto1));

    expect(mockTx.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockedDto1.managerId },
    });

    expect(mockTx.organization.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: mockedDto1.organizationName,
          mode: 'insensitive',
        },
      },
    });

    expect(mockTx.organization.create).toHaveBeenCalledWith({
      data: {
        name: mockedDto1.organizationName,
        industry: mockedDto1.industry,
        size: mockedDto1.size,
        address: mockedDto1.address,
        inviteCode: 'ABCD1234',
        managerId: mockedDto1.managerId,
      },
    });

    expect(mockTx.user.updateMany).toHaveBeenCalledWith({
      where: { id: mockedDto1.managerId, organizationId: null },
      data: {
        organizationId: 'org-1',
        role: UserRole.MANAGER,
        name: mockedDto1.managerName,
      },
    });
  });

  it('should throw SingleOrganizationLimitFoundException if user already has org', async () => {
    const mockTx = {
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ organizationId: 'org-existing' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      organization: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    prisma.$transaction.mockImplementation(async (tx) => tx(mockTx));

    await expect(
      handler.execute(new CreateOrganizationCommand(mockedDto1)),
    ).rejects.toThrow(SingleOrganizationLimitFoundException);

    expect(mockTx.organization.findFirst).not.toHaveBeenCalled();
    expect(mockTx.organization.create).not.toHaveBeenCalled();
    expect(mockTx.user.updateMany).not.toHaveBeenCalled();
  });

  it('should throw OrganizationNameAlreadyExistsException for duplicate names', async () => {
    const mockTx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      organization: {
        findFirst: jest.fn().mockResolvedValue({ id: 'existing-org' }),
        create: jest.fn(),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) =>
      callback(mockTx),
    );

    await expect(
      handler.execute(new CreateOrganizationCommand(mockedDto2)),
    ).rejects.toThrow(OrganizationNameAlreadyExistsException);

    expect(mockTx.organization.create).not.toHaveBeenCalled();
    expect(mockTx.user.updateMany).not.toHaveBeenCalled();
  });

  it('should propagate a failed transaction without retrying', async () => {
    const error = new Error('Database operation failed');
    prisma.$transaction.mockRejectedValue(error);

    await expect(
      handler.execute(new CreateOrganizationCommand(mockedDto1)),
    ).rejects.toBe(error);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('should return a conflict when another request wins the conditional assignment', async () => {
    const tx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      organization: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'losing-org' }),
      },
    };
    prisma.$transaction.mockImplementation(async (write) => write(tx));

    await expect(
      handler.execute(new CreateOrganizationCommand(mockedDto1)),
    ).rejects.toMatchObject({ status: 409 });
  });
});
