import { ApiPropertyOptional } from '@nestjs/swagger';
import { IGetWorkEntriesQueryDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { TimePeriodDto } from 'src/shared/dto/time-period.dto';

export class GetWorkEntriesQueryDto implements IGetWorkEntriesQueryDto {
  @ApiPropertyOptional({ type: () => TimePeriodDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimePeriodDto)
  currentWeek?: TimePeriodDto;
}
