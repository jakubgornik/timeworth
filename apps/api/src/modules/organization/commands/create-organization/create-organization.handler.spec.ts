import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService, UserRole } from '@packages/db';
import { CreateOrganizationHandler } from './create-organization.handler';
import { CreateOrganizationCommand } from './create-organization.command';
import {
  SingleOrganizationLimitFoundException,
  OrganizationNameAlreadyExistsException,
} from '../../exceptions/organization.exception';
import { Prisma } from '@packages/db';

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
        update: jest.fn(),
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

    expect(mockTx.user.update).toHaveBeenCalledWith({
      where: { id: mockedDto1.managerId },
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
        update: jest.fn(),
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
    expect(mockTx.user.update).not.toHaveBeenCalled();
  });

  it('should throw OrganizationNameAlreadyExistsException for duplicate names', async () => {
    const mockTx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ organizationId: null }),
        update: jest.fn(),
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
    expect(mockTx.user.update).not.toHaveBeenCalled();
  });

  it('should retry on inviteCode conflict (P2002)', async () => {
    const p2002Error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: { target: ['inviteCode'] },
      },
    );

    jest
      .spyOn(handler as any, 'createOrganizationWithManager')
      .mockRejectedValueOnce(p2002Error)
      .mockResolvedValueOnce(undefined);

    await handler.execute(new CreateOrganizationCommand(mockedDto1));

    expect(handler['createOrganizationWithManager']).toHaveBeenCalledTimes(2);
    expect(handler['generateInviteCode']).toHaveBeenCalledTimes(2);
  });
});
