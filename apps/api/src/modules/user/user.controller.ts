import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

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

  @Post()
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.registerUser(registerUserDto);
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
