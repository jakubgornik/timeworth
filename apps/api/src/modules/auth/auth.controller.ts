import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(@Body() dto: LoginUserDto) {
  //   const loginResponse = await this.authService.login(dto);

  //   if (!loginResponse) {
  //     throw new UnauthorizedException('Invalid user credentials');
  //   }

  //   return loginResponse;
  // }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
