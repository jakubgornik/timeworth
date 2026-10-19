import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @AuthEndpoint()
  async getOrganization(@CurrentUser() user: AuthenticatedUser) {
    return await this.organizationService.getOrganization(user);
  }

  @Post('join-organization')
  @AuthEndpoint()
  async joinOrganization(
    @Body() dto: JoinOrganizationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.organizationService.joinOrganization(dto, user);
  }

  @Post('create-organization')
  @AuthEndpoint()
  async createOrganization(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.organizationService.createOrganization(dto, user);
  }
}
