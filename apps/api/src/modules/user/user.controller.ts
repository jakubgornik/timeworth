import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '@packages/db';
import { Request } from 'express';
import { OrganizationUsersQueryDto } from './dto/organization-users.dto';
import { UserService } from './user.service';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly service: UserService,
  ) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.registerUser(registerUserDto);
    return user;
  }

  // TODO  use query bus
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        organization: {
          select: {
            id: true,
            name: true,
            managerId: true,
          },
        },
        role: true,
      },
    });

    return user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('organization-users')
  async getOrganizationUsers(
    @Query() organizationUsersQueryDto: OrganizationUsersQueryDto,
  ) {
    return await this.service.getOrganizationUsers(organizationUsersQueryDto);
  }

  // These are examples how to work with queries and commands
  // @Get()
  // async getUsers() {
  //   return await this.service.getUsers();
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string) {
  //   return await this.service.deleteUser(id);
  // }
  //
}
