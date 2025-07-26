import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateWorkEntryDto } from '@packages/types';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateWorkEntryDto implements ICreateWorkEntryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @ApiPropertyOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  organizationId: string;
}
