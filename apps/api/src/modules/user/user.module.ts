import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersQueryHandler } from './queries/get-users/get-users.handler';
import { PrismaModule } from '@packages/db';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { AuthModule } from '../auth/auth.module';

const services = [UserService];

const queryHandlers = [GetUsersQueryHandler];

const commandHandlers = [DeleteUserHandler];

@Module({
  controllers: [UserController],
  providers: [...services, ...queryHandlers, ...commandHandlers],
  exports: [UserService],
  imports: [CqrsModule, PrismaModule, AuthModule],
})
export class UserModule {}
