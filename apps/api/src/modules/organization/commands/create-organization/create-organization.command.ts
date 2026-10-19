import { Command } from '@nestjs/cqrs';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';

export type CreateOrganizationInput = CreateOrganizationDto & {
  managerId: string;
};

export class CreateOrganizationCommand extends Command<void> {
  constructor(public readonly createOrganizationDto: CreateOrganizationInput) {
    super();
  }
}
