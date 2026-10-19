import {
  Body,
  Controller,
  Delete,
  Get,
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

  @Delete('me')
  @AuthEndpoint()
  async deleteUser(@Req() req: RequestWithUser) {
    return this.authService.deleteUser(req.user.userId);
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

  @Get()
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

  @Get('listed-organization-users')
  @AuthEndpoint()
  async getListedOrganizationUsers(
    @Query('organizationId') organizationId: string,
  ) {
    return await this.userService.getListedOrganizationUsers(organizationId);
  }
}
