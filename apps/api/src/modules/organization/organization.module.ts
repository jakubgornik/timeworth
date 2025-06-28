import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrganizationHandler } from './commands/create-organization/create-organization.handler';
import { JoinOrganizationHandler } from './commands/join-organization/join-organization.handler';
import { PrismaModule } from '@packages/db';
import { AuthModule } from '../auth/auth.module';

const commandHandlers = [CreateOrganizationHandler, JoinOrganizationHandler];

@Module({
  imports: [CqrsModule, PrismaModule, AuthModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, ...commandHandlers],
})
export class OrganizationModule {}
