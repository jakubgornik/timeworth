import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersQueryHandler } from './queries/get-users/get-users.handler';
import { PrismaModule, PrismaService } from '@packages/db';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { AuthService } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';

const services = [UserService, AuthService, PrismaService, SupabaseService];

const queryHandlers = [GetUsersQueryHandler];

const commandHandlers = [DeleteUserHandler];

@Module({
  controllers: [UserController],
  providers: [...services, ...queryHandlers, ...commandHandlers],
  exports: [UserService],
  imports: [CqrsModule, PrismaModule],
})
export class UserModule {}
