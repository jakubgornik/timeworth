import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { IOrganizationDto } from '@packages/types';
import { UserNotFoundException } from '../../../user/exceptions/user.exception';
import { GetOrganizationQuery } from './get-organization.query';
import { ManagerNotFoundException } from 'src/modules/work-entry/exceptions/work-entry.exceptions';

@QueryHandler(GetOrganizationQuery)
export class GetOrganizationHandler
  implements IQueryHandler<GetOrganizationQuery, IOrganizationDto>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetOrganizationQuery): Promise<IOrganizationDto> {
    if (!dto.managerId) {
      throw new ManagerNotFoundException();
    }

    return this.getOrganization(dto.managerId);
  }

  private async getOrganization(managerId: string): Promise<IOrganizationDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { managerId },
    });

    if (!organization) {
      throw new UserNotFoundException();
    }

    return {
      ...organization,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }
}
