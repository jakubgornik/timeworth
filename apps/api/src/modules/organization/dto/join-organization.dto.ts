import { ApiProperty } from '@nestjs/swagger';
import { IJoinOrganizationDto } from '@packages/types';
import { IsString } from 'class-validator';

export class JoinOrganizationDto implements IJoinOrganizationDto {
  @ApiProperty()
  @IsString()
  inviteCode: string;

  @ApiProperty()
  @IsString()
  name: string;
}
