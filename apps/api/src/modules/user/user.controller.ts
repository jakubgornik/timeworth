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
import { Request } from 'express';
import { UserService } from './user.service';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { OrganizationUsersFiltersDto } from './dto/organization-users-filters.dto';

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
    private readonly userService: UserService,
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

  @Get('me')
  @AuthEndpoint()
  async getMe(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    return await this.userService.getUserById(userId);
  }

  @Get('organization-users')
  @AuthEndpoint()
  async getOrganizationUsers(
    @Query('managerId') managerId: string,
    @Query('search') search: string,
    @Query() filtersDto: OrganizationUsersFiltersDto,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.userService.getOrganizationUsers(
      managerId,
      search,
      paginationDto,
      sortDto,
      filtersDto,
    );
  }

  @Get('user-status-options')
  @AuthEndpoint()
  async getUserStatusOptions() {
    return await this.userService.getUserStatusOptions();
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
