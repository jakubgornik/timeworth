import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@packages/db';
import { GetWorkEntriesHandler } from './get-work-entries.handler';
import { GetWorkEntriesQuery } from './get-work-entries.query';
import { IWorkEntryToEventDto } from '@packages/types';
import { mapWorkEntryToEvent } from '../../utils/map-work-entry-to-event';
import { UserNotFoundException } from '../../../user/exceptions/user.exception';

jest.mock('../../utils/map-work-entry-to-event');

describe('GetWorkEntriesHandler', () => {
  let handler: GetWorkEntriesHandler;
  let prisma: {
    workEntry: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prisma = {
      workEntry: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWorkEntriesHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = module.get<GetWorkEntriesHandler>(GetWorkEntriesHandler);
    expect(handler).toBeDefined();
  });

  it('should throw error if userId is missing', async () => {
    const query = new GetWorkEntriesQuery({
      userId: undefined as any,
      currentWeek: { from: new Date(), to: new Date() },
    });

    await expect(handler.execute(query)).rejects.toThrow(UserNotFoundException);
    expect(prisma.workEntry.findMany).not.toHaveBeenCalled();
  });

  it('should return mapped work entries if found', async () => {
    const mockWorkEntries = [
      { id: 'we1', userId: 'user-123', startedAt: new Date() },
      { id: 'we2', userId: 'user-123', startedAt: new Date() },
    ];

    prisma.workEntry.findMany.mockResolvedValue(mockWorkEntries);

    const mockMappedEntries: IWorkEntryToEventDto[] = [
      { id: 'mapped-we1' } as IWorkEntryToEventDto,
      { id: 'mapped-we2' } as IWorkEntryToEventDto,
    ];

    (mapWorkEntryToEvent as jest.Mock).mockImplementation((entry) => {
      return mockMappedEntries.find((e) => e.id.includes(entry.id));
    });

    const query = new GetWorkEntriesQuery({
      userId: 'user-123',
      currentWeek: { from: new Date(), to: new Date() },
    });

    const result = await handler.execute(query);

    expect(result).toEqual(mockMappedEntries);
    expect(prisma.workEntry.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-123',
        startedAt: {
          gte: query.getWorkEntriesQueryDto.currentWeek?.from,
          lte: query.getWorkEntriesQueryDto.currentWeek?.to,
        },
      },
    });
    expect(mapWorkEntryToEvent).toHaveBeenCalledTimes(2);
  });

  it('should return empty array if no work entries are found', async () => {
    prisma.workEntry.findMany.mockResolvedValue([]);

    const query = new GetWorkEntriesQuery({
      userId: 'user-123',
      currentWeek: { from: new Date(), to: new Date() },
    });

    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(prisma.workEntry.findMany).toHaveBeenCalled();
    expect(mapWorkEntryToEvent).not.toHaveBeenCalled();
  });
});
