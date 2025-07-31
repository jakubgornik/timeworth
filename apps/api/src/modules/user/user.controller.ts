import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { PrismaService } from '@packages/db';
import { Request } from 'express';
import { UserService } from './user.service';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';

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
  @Get('me')
  @AuthEndpoint()
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

  @Get('organization-users')
  @AuthEndpoint()
  async getOrganizationUsers(
    @Query('managerId') managerId: string,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.service.getOrganizationUsers(
      managerId,
      paginationDto,
      sortDto,
    );
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
