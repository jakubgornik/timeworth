import { ApiProperty } from '@nestjs/swagger';
import { IUserCredentialsDto } from '@packages/types';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto implements IUserCredentialsDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginUserDto extends RegisterUserDto {}
