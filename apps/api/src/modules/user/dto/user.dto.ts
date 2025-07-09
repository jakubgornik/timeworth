import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@packages/db';
import { IUserDto } from '@packages/types';

export class UserDto implements IUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  name?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiProperty()
  status: UserStatus;

  @ApiPropertyOptional()
  skills?: string[] | null;
}
