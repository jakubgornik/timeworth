import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserDto } from '@packages/types';

export class UserDto implements IUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  name?: string | null;
}
