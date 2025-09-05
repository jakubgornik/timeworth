import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { GetOrganizationUsersHandler } from './get-organization-users.handler';
import { GetOrganizationUsersQuery } from './get-organization-users.query';
import { ManagerNotFoundException } from '../../exceptions/user.exception';
import { mapUsersSortDtoToOrderBy } from '../../../../shared/mappers/map-users-sort-dto-to-order-by';
import { mapOrganizationUsersFiltersDtoToWhere } from '../../../../shared/mappers/map-organization-users-filters-dto-to-where';

jest.mock('../../../../shared/mappers/map-users-sort-dto-to-order-by');
jest.mock(
  '../../../../shared/mappers/map-organization-users-filters-dto-to-where',
);

const mockUsers = [
  {
    id: 'u1',
    email: 'u1@test.com',
    role: 'EMPLOYEE',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-02T00:00:00Z'),
    organization: {
      id: 'org1',
      name: 'Org 1',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-02T00:00:00Z'),
      industry: null,
      size: null,
      address: null,
    },
  },
  {
    id: 'u2',
    email: 'u2@test.com',
    role: 'EMPLOYEE',
    createdAt: new Date('2025-01-03T00:00:00Z'),
    updatedAt: new Date('2025-01-04T00:00:00Z'),
    organization: null,
  },
];

describe('GetOrganizationUsersHandler', () => {
  let handler: GetOrganizationUsersHandler;
  let prisma: {
    user: {
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    (mapUsersSortDtoToOrderBy as jest.Mock).mockReturnValue({ id: 'asc' });
    (mapOrganizationUsersFiltersDtoToWhere as jest.Mock).mockReturnValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrganizationUsersHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<GetOrganizationUsersHandler>(
      GetOrganizationUsersHandler,
    );
  });

  it('should throw ManagerNotFoundException if managerId is missing', async () => {
    const query = new GetOrganizationUsersQuery(
      '',
      '',
      { page: 1, pageSize: 10 },
      {},
      {},
    );

    await expect(handler.execute(query)).rejects.toThrow(
      ManagerNotFoundException,
    );
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });

  it('should return paginated users with transformed dates and organization', async () => {
    const managerId = 'manager-1';
    const query = new GetOrganizationUsersQuery(
      managerId,
      'search-term',
      { page: 1, pageSize: 2 },
      { id: 'id', desc: false },
      {},
    );

    prisma.user.findMany.mockResolvedValue(mockUsers);
    prisma.user.count.mockResolvedValue(2);

    const result = await handler.execute(query);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      where: {
        role: 'EMPLOYEE',
        organization: { managerId },
      },
      include: { organization: true },
      skip: 0,
      take: 2,
    });

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: {
        role: 'EMPLOYEE',
        organization: { managerId },
      },
    });

    expect(result).toEqual({
      data: [
        {
          ...mockUsers[0],
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
          organization: {
            ...mockUsers[0].organization,
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-02T00:00:00.000Z',
            industry: undefined,
            size: undefined,
            address: undefined,
          },
        },
        {
          ...mockUsers[1],
          createdAt: '2025-01-03T00:00:00.000Z',
          updatedAt: '2025-01-04T00:00:00.000Z',
          organization: null,
        },
      ],
      totalCount: 2,
      totalPages: 1,
    });
  });
});
