import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JoinOrganizationCommand } from './commands/join-organization/join-organization.command';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateOrganizationCommand } from './commands/create-organization/create-organization.command';
import { GetOrganizationQuery } from './query/get-organization/get-organization.query';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getOrganization(managerId: string) {
    return await this.queryBus.execute<GetOrganizationQuery>(
      new GetOrganizationQuery(managerId),
    );
  }

  async joinOrganization(dto: JoinOrganizationDto) {
    return await this.commandBus.execute<JoinOrganizationCommand, void>(
      new JoinOrganizationCommand(dto),
    );
  }

  async createOrganization(dto: CreateOrganizationDto) {
    return await this.commandBus.execute<CreateOrganizationCommand, void>(
      new CreateOrganizationCommand(dto),
    );
  }
}
