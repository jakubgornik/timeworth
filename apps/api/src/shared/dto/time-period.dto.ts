import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class TimePeriodDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  to: Date;
}
