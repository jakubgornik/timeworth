import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserService } from './user.service';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { OrganizationUsersFiltersDto } from './dto/organization-users-filters.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Delete('me')
  @AuthEndpoint()
  async deleteUser(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.deleteUser(user.userId);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.registerUser(registerUserDto);
    return user;
  }

  @Get('me')
  @AuthEndpoint()
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const userId = user.userId;

    return await this.userService.getUserById(userId);
  }

  @Get()
  @AuthEndpoint()
  async getOrganizationUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search: string,
    @Query() filtersDto: OrganizationUsersFiltersDto,
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ) {
    return await this.userService.getOrganizationUsers(
      user,
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
  async getListedOrganizationUsers(@CurrentUser() user: AuthenticatedUser) {
    return await this.userService.getListedOrganizationUsers(user);
  }
}
