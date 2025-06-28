import { ApiProperty } from '@nestjs/swagger';
import { IJoinOrganizationDto } from '@packages/types';
import { IsString } from 'class-validator';

export class JoinOrganizationDto implements IJoinOrganizationDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  inviteCode: string;
}
