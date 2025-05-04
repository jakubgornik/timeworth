import { ApiProperty } from '@nestjs/swagger';
import { IRegisterDto } from '@packages/types';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto implements IRegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}
