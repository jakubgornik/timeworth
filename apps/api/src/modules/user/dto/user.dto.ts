import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
}
