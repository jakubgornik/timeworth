import { Command } from '@nestjs/cqrs';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';

export class CreateOrganizationCommand extends Command<void> {
  constructor(public readonly dto: CreateOrganizationDto) {
    super();
  }
}
