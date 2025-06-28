import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JoinOrganizationCommand } from './commands/join-organization/join-organization.command';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateOrganizationCommand } from './commands/create-organization/create-organization.command';

@Injectable()
export class OrganizationService {
  constructor(private readonly commandBus: CommandBus) {}

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
