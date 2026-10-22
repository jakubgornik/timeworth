import { ApiProperty } from '@nestjs/swagger';
import { IPaginationDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationDto implements IPaginationDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({ minimum: 1, maximum: 100 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  pageSize: number;
}
