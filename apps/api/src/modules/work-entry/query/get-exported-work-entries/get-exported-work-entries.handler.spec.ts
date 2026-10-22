import { Test, TestingModule } from '@nestjs/testing';
import { GetExportedWorkEntriesHandler } from './get-exported-work-entries.handler';
import { GetExportedWorkEntriesQuery } from './get-exported-work-entries.query';
import { PrismaService } from '@packages/db';
import { IWorkEntryDto } from '@packages/types';
import { AuthenticatedUser } from '../../../../shared/auth/authenticated-user';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { OrganizationWorkEntriesFiltersDto } from '../../dto/organization-work-entries-filters.dto';

describe('GetExportedWorkEntriesHandler', () => {
  const user: AuthenticatedUser = {
    userId: 'manager-1',
    email: 'manager@example.com',
    role: 'MANAGER',
    organizationId: 'org-1',
    organizationManagerId: 'manager-1',
  };
  let handler: GetExportedWorkEntriesHandler;
  let prisma: { workEntry: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      workEntry: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetExportedWorkEntriesHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get(GetExportedWorkEntriesHandler);
    jest.clearAllMocks();
  });

  it('should combine real filters with organization scope and return work entries', async () => {
    const filtersDto = {
      title: 'Work A',
    };
    const where = { title: { contains: 'Work A', mode: 'insensitive' } };
    const mockResults: IWorkEntryDto[] = [
      {
        id: 'entry-1',
        title: 'Work A',
        startedAt: new Date(),
        endedAt: new Date(),
        description: 'test',
        hoursWorked: 2,
        userId: 'user-1',
        organizationId: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        billable: true,
        approved: false,
      },
    ];

    prisma.workEntry.findMany.mockResolvedValue(mockResults);

    const query = new GetExportedWorkEntriesQuery(filtersDto, user);
    const result = await handler.execute(query);

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org-1', AND: where },
      orderBy: { startedAt: 'desc' },
    });
    expect(result).toEqual(mockResults);
  });

  it('should retain organization scope with empty filters', async () => {
    const filtersDto = {};
    prisma.workEntry.findMany.mockResolvedValue([]);

    const query = new GetExportedWorkEntriesQuery(filtersDto, user);
    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org-1', AND: {} },
      orderBy: { startedAt: 'desc' },
    });
  });

  it('should retain and apply search from the validated export body', async () => {
    const pipe = new ValidationPipe({ transform: true, whitelist: true });
    const filters: OrganizationWorkEntriesFiltersDto = await pipe.transform(
      { search: 'Project Alpha', page: 2, pageSize: 1 },
      { type: 'body', metatype: OrganizationWorkEntriesFiltersDto },
    );
    prisma.workEntry.findMany.mockResolvedValue([]);

    await handler.execute(new GetExportedWorkEntriesQuery(filters, user));

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        AND: {
          AND: [{ title: { contains: 'Project Alpha', mode: 'insensitive' } }],
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  });

  it('should apply search, date, title and hours together without pagination', async () => {
    prisma.workEntry.findMany.mockResolvedValue([]);
    const filters = {
      search: 'Alpha',
      title: 'Planning',
      hoursWorked: 0,
      workEntryStartedAt: '2026-10-01T00:00:00.000Z',
      workEntryEndedAt: '2026-10-22T00:00:00.000Z',
    };

    await handler.execute(new GetExportedWorkEntriesQuery(filters, user));

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        AND: {
          AND: [{ title: { contains: 'Alpha', mode: 'insensitive' } }],
          OR: expect.any(Array),
          title: { contains: 'Planning', mode: 'insensitive' },
          hoursWorked: 0,
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  });

  it.each([123, ['Alpha'], { contains: 'Alpha' }])(
    'should reject invalid search in the export body: %j',
    async (search) => {
      const pipe = new ValidationPipe({ transform: true, whitelist: true });
      await expect(
        pipe.transform(
          { search },
          { type: 'body', metatype: OrganizationWorkEntriesFiltersDto },
        ),
      ).rejects.toMatchObject({ status: 400 });
    },
  );

  it.each<Partial<AuthenticatedUser>>([
    { role: 'EMPLOYEE' },
    { organizationId: null },
    { organizationManagerId: 'another-manager' },
    { organizationManagerId: null },
  ])(
    'should reject an unauthorized actor before reading entries: %j',
    async (overrides) => {
      await expect(
        handler.execute(
          new GetExportedWorkEntriesQuery({}, { ...user, ...overrides }),
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.workEntry.findMany).not.toHaveBeenCalled();
    },
  );

  it('should scope another manager to their own organization', async () => {
    prisma.workEntry.findMany.mockResolvedValue([]);
    const otherManager: AuthenticatedUser = {
      ...user,
      userId: 'manager-2',
      organizationId: 'org-2',
      organizationManagerId: 'manager-2',
    };

    await handler.execute(new GetExportedWorkEntriesQuery({}, otherManager));

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org-2', AND: {} },
      orderBy: { startedAt: 'desc' },
    });
  });

  it('should ignore client-supplied identity and raw Prisma predicates in filters', async () => {
    prisma.workEntry.findMany.mockResolvedValue([]);
    const filters = {
      title: 'Work A',
      organizationId: 'org-2',
      userId: 'manager-2',
      user: { ...user, organizationId: 'org-2' },
      OR: [{ organizationId: 'org-2' }],
      AND: {},
    };

    await handler.execute(new GetExportedWorkEntriesQuery(filters, user));

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        AND: { title: { contains: 'Work A', mode: 'insensitive' } },
      },
      orderBy: { startedAt: 'desc' },
    });
  });

  it('should keep date OR predicates inside the mandatory organization scope', async () => {
    prisma.workEntry.findMany.mockResolvedValue([]);
    const filters = {
      workEntryStartedAt: '2026-10-01T00:00:00.000Z',
      workEntryEndedAt: '2026-10-22T00:00:00.000Z',
    };

    await handler.execute(new GetExportedWorkEntriesQuery(filters, user));

    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-1',
        AND: expect.objectContaining({ OR: expect.any(Array) }),
      },
      orderBy: { startedAt: 'desc' },
    });
  });
});
