import { Command } from '@nestjs/cqrs';
import { JoinOrganizationDto } from '../../dto/join-organization.dto';

export class JoinOrganizationCommand extends Command<void> {
  constructor(public readonly JoinOrganizationDto: JoinOrganizationDto) {
    super();
  }
}
