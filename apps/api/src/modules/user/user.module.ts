import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersQueryHandler } from './queries/get-users/get-users.handler';
import { PrismaModule } from '@packages/db';

const services = [UserService];

const queryHandlers = [GetUsersQueryHandler];

const commandHandlers = [];

@Module({
  controllers: [UserController],
  providers: [...services, ...queryHandlers, ...commandHandlers],
  exports: [UserService],
  imports: [CqrsModule, PrismaModule],
})
export class UserModule {}
