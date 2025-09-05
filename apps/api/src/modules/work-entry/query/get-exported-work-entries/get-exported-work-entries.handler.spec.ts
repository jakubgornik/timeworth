import { Test, TestingModule } from '@nestjs/testing';
import { GetExportedWorkEntriesHandler } from './get-exported-work-entries.handler';
import { GetExportedWorkEntriesQuery } from './get-exported-work-entries.query';
import { PrismaService } from '@packages/db';
import { IWorkEntryDto } from '@packages/types';
import { mapOrganizationWorkEntriesFiltersDtoToWhere } from '../../../../shared/mappers/map-organization-work-entries-filters-dto-to-where';

jest.mock(
  '../../../../shared/mappers/map-organization-work-entries-filters-dto-to-where',
);

describe('GetExportedWorkEntriesHandler', () => {
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

  it('should call mapper with filtersDto and return work entries', async () => {
    const filtersDto = {
      title: 'Work A',
    };
    const where = { userId: 'user-1' };
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

    (mapOrganizationWorkEntriesFiltersDtoToWhere as jest.Mock).mockReturnValue(
      where,
    );
    prisma.workEntry.findMany.mockResolvedValue(mockResults);

    const query = new GetExportedWorkEntriesQuery(filtersDto);
    const result = await handler.execute(query);

    expect(mapOrganizationWorkEntriesFiltersDtoToWhere).toHaveBeenCalledWith(
      filtersDto,
    );
    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where,
      orderBy: { startedAt: 'desc' },
    });
    expect(result).toEqual(mockResults);
  });

  it('should handle empty filtersDto', async () => {
    const filtersDto = {};
    (mapOrganizationWorkEntriesFiltersDtoToWhere as jest.Mock).mockReturnValue(
      {},
    );
    prisma.workEntry.findMany.mockResolvedValue([]);

    const query = new GetExportedWorkEntriesQuery(filtersDto);
    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { startedAt: 'desc' },
    });
  });
});
