import { ApiProperty } from '@nestjs/swagger';
import { IOrganizationUsersQueryDto } from '@packages/types';
import { IsInt, IsString, Min } from 'class-validator';

// TODO: extract to a common PaginationDto
export class OrganizationUsersQueryDto implements IOrganizationUsersQueryDto {
  @ApiProperty()
  @IsString()
  managerId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  pageSize: number;
}
