import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JoinOrganizationCommand } from './commands/join-organization/join-organization.command';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateOrganizationCommand } from './commands/create-organization/create-organization.command';
import { GetOrganizationQuery } from './query/get-organization/get-organization.query';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { requireManagerOrganization } from '../../shared/auth/authorization';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getOrganization(user: AuthenticatedUser) {
    return await this.queryBus.execute<GetOrganizationQuery>(
      new GetOrganizationQuery(requireManagerOrganization(user)),
    );
  }

  async joinOrganization(dto: JoinOrganizationDto, user: AuthenticatedUser) {
    return await this.commandBus.execute<JoinOrganizationCommand, void>(
      new JoinOrganizationCommand({ ...dto, userId: user.userId }),
    );
  }

  async createOrganization(
    dto: CreateOrganizationDto,
    user: AuthenticatedUser,
  ) {
    return await this.commandBus.execute<CreateOrganizationCommand, void>(
      new CreateOrganizationCommand({ ...dto, managerId: user.userId }),
    );
  }
}
