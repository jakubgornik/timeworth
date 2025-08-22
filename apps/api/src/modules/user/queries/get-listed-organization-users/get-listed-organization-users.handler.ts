import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { SelectedUser } from '@packages/types';
import { GetListedOrganizationUsersQuery } from './get-listed-organization-users.query';

@QueryHandler(GetListedOrganizationUsersQuery)
export class GetListedOrganizationUsersHandler
  implements IQueryHandler<GetListedOrganizationUsersQuery, SelectedUser[]>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    organizationId,
  }: GetListedOrganizationUsersQuery): Promise<SelectedUser[]> {
    return await this.getListedOrganizationUsers(organizationId);
  }

  private async getListedOrganizationUsers(
    organizationId: string,
  ): Promise<SelectedUser[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        name: true,
      },
    });

    // TODO: db migration name should be required, set during join organization
    return users.filter((user): user is SelectedUser => user.name !== null);
  }
}
