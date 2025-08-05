import { ApiPropertyOptional } from '@nestjs/swagger';
import { IOrganizationWorkEntriesFiltersDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrganizationWorkEntriesFiltersDto
  implements IOrganizationWorkEntriesFiltersDto
{
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  hoursWorked?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workEntryEndedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workEntryStartedAt?: string;
}
