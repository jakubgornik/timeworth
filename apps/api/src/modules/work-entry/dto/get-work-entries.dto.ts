import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IGetWorkEntriesQueryDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

class TimePeriodDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  to: Date;
}

export class GetWorkEntriesQueryDto implements IGetWorkEntriesQueryDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({ type: () => TimePeriodDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimePeriodDto)
  currentWeek?: TimePeriodDto;
}
