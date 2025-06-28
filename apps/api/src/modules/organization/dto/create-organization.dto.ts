import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ICreateOrganizationDto } from '@packages/types';

export class CreateOrganizationDto implements ICreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  managerId: string;
}
