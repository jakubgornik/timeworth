import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService, StoredFile } from '@packages/db';
import { GetEmployeeFilesQuery } from './get-employee-files.query';

@QueryHandler(GetEmployeeFilesQuery)
export class GetEmployeeFilesHandler
  implements IQueryHandler<GetEmployeeFilesQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  // todo
  async execute({ userId }: GetEmployeeFilesQuery): Promise<StoredFile[]> {
    return await this.prisma.storedFile.findMany({
      where: {
        userId: userId,
        status: 'UPLOADED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
