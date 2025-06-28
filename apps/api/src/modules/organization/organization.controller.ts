import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AuthGuard } from '@nestjs/passport';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('join-organization')
  async joinOrganization(@Body() dto: JoinOrganizationDto) {
    return await this.organizationService.joinOrganization(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-organization')
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    return await this.organizationService.createOrganization(dto);
  }
}
