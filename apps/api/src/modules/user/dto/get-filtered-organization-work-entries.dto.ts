import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class GetFilteredOrganizationWorkEntriesDto {
  @IsString()
  managerId: string;

  @IsOptional()
  @IsString()
  selectedUserId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsNumberString()
  year?: string;
}
