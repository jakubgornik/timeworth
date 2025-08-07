import { ApiPropertyOptional } from '@nestjs/swagger';
import { IOrganizationUsersFiltersDto } from '@packages/types';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@packages/db';
import { TransformArray } from 'src/shared/decorators/transform-array.decorator';

export class OrganizationUsersFiltersDto
  implements IOrganizationUsersFiltersDto
{
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  @TransformArray()
  userStatus?: UserStatus[];
}
