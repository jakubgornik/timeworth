import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '@packages/db';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.registerUser(registerUserDto);
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });

    return user;
  }

  // These are examples how to work with queries and commands
  // @Get()
  // async getUsers() {
  //   return await this.service.getUsers();
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string) {
  //   return await this.service.deleteUser(id);
  // }
  //
}
