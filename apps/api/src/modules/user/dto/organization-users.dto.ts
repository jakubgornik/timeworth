import { ApiProperty } from '@nestjs/swagger';
import { IOrganizationUsersQueryDto } from '@packages/types';
import { IsInt, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// TODO: extract to a common PaginationDto
export class OrganizationUsersQueryDto implements IOrganizationUsersQueryDto {
  @ApiProperty()
  @IsString()
  managerId: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  pageSize: number;
}
