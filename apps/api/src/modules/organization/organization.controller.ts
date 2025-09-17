import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AuthEndpoint } from 'src/shared/decorators/auth.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @AuthEndpoint()
  async getOrganization(@Query('managerId') managerId: string) {
    return await this.organizationService.getOrganization(managerId);
  }

  @Post('join-organization')
  @AuthEndpoint()
  async joinOrganization(@Body() dto: JoinOrganizationDto) {
    return await this.organizationService.joinOrganization(dto);
  }

  @Post('create-organization')
  @AuthEndpoint()
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    return await this.organizationService.createOrganization(dto);
  }
}
