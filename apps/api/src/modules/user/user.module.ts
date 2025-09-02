import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@packages/db';
import { AuthModule } from '../auth/auth.module';
import { GetOrganizationUsersHandler } from './queries/get-organization-users/get-organization-users.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id/get-user-by-id.handler';
import { GetUserStatusOptionsHandler } from './queries/get-user-status-options/get-user-status-options.handler';
import { GetListedOrganizationUsersHandler } from './queries/get-listed-organization-users/get-listed-organization-users.handler';

const services = [UserService];

const queryHandlers = [
  GetOrganizationUsersHandler,
  GetUserByIdHandler,
  GetUserStatusOptionsHandler,
  GetListedOrganizationUsersHandler,
];

const commandHandlers = [];

@Module({
  controllers: [UserController],
  providers: [...services, ...queryHandlers, ...commandHandlers],
  exports: [UserService],
  imports: [CqrsModule, PrismaModule, AuthModule],
})
export class UserModule {}
