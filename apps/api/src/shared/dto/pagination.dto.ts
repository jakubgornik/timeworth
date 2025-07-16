import { ApiProperty } from '@nestjs/swagger';
import { IPaginationDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDto implements IPaginationDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageSize: number;
}
