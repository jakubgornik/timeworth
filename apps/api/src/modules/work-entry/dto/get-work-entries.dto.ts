import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IGetWorkEntriesQueryDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { TimePeriodDto } from 'src/shared/dto/time-period.dto';

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
