import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, PrismaService } from '@packages/db';
import { GetEmployeeFilesQuery } from './get-employee-files.query';
import { IPaginatedResponseDto, IStorageFileDto } from '@packages/types';
import { mapStorageSortDtoToOrderBy } from 'src/shared/mappers/map-storage-sort-dto-to-order-by';

@QueryHandler(GetEmployeeFilesQuery)
export class GetEmployeeFilesHandler
  implements IQueryHandler<GetEmployeeFilesQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetEmployeeFilesQuery,
  ): Promise<IPaginatedResponseDto<IStorageFileDto>> {
    const {
      userId,
      paginationDto: { page, pageSize },
      sortDto,
    } = query;

    const orderBy = mapStorageSortDtoToOrderBy(sortDto);

    const where: Prisma.StoredFileWhereInput = {
      userId,
      status: 'UPLOADED',
    };

    const [storage, totalCount] = await Promise.all([
      this.prisma.storedFile.findMany({
        orderBy,
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.storedFile.count({
        where,
      }),
    ]);

    return {
      data: storage.map((entry) => ({
        id: entry.id,
        name: entry.name,
        type: entry.type,
        size: entry.size,
        uploadDate: entry.createdAt.toISOString(),
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
