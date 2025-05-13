import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const loginResponse = await this.authService.login(dto);

    if (!loginResponse) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    return loginResponse;
  }
}
